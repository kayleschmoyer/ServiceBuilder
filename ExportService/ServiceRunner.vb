Imports System.ServiceProcess
Imports System.Timers
Imports System.Data.SqlClient
Imports System.IO
Imports System.Text.Json
Imports Renci.SshNet

Public Class ServiceRunner
    Inherits ServiceBase

    Private _timer As Timer
    Private _intervalMinutes As Integer

    Public Sub New()
        ServiceName = "ExportService"
        EventLog.Log = "Application"
    End Sub

    Protected Overrides Sub OnStart(ByVal args() As String)
        Try
            ReadConfig()
            _timer = New Timer(_intervalMinutes * 60 * 1000)
            AddHandler _timer.Elapsed, AddressOf OnElapsed
            _timer.AutoReset = True
            _timer.Enabled = True
            EventLog.WriteEntry("Service started.")
        Catch ex As Exception
            EventLog.WriteEntry($"Error starting service: {ex.Message}", EventLogEntryType.Error)
            Throw
        End Try
    End Sub

    Private Sub ReadConfig()
        Dim interval = System.Configuration.ConfigurationManager.AppSettings("ExportIntervalMinutes")
        If Not Integer.TryParse(interval, _intervalMinutes) Then
            _intervalMinutes = 60
        End If
    End Sub

    Private Sub OnElapsed(sender As Object, e As ElapsedEventArgs)
        _timer.Stop()
        Try
            ExportAndUpload()
            EventLog.WriteEntry("Export completed successfully.")
        Catch ex As Exception
            EventLog.WriteEntry($"Export failed: {ex.Message}", EventLogEntryType.Error)
        Finally
            _timer.Start()
        End Try
    End Sub

    Private Sub ExportAndUpload()
        Dim query = System.Configuration.ConfigurationManager.AppSettings("ExportQuery")
        Dim mapping = System.Configuration.ConfigurationManager.AppSettings("ColumnMapping")
        Dim format = System.Configuration.ConfigurationManager.AppSettings("ExportFormat")
        Dim connStr = System.Configuration.ConfigurationManager.ConnectionStrings("DefaultConnection").ConnectionString

        Dim dt As New DataTable()
        Using conn As New SqlConnection(connStr)
            Using cmd As New SqlCommand(query, conn)
                conn.Open()
                Using reader As SqlDataReader = cmd.ExecuteReader()
                    dt.Load(reader)
                End Using
            End Using
        End Using

        Dim orderedCols = New List(Of String)()
        Dim nameMap = New Dictionary(Of String, String)()
        For Each pair In mapping.Split({","}, StringSplitOptions.RemoveEmptyEntries)
            Dim parts = pair.Split("=")
            If parts.Length = 2 Then
                orderedCols.Add(parts(0))
                nameMap(parts(0)) = parts(1)
            End If
        Next

        Dim newTable As New DataTable()
        For Each col In orderedCols
            Dim colName = If(nameMap.ContainsKey(col), nameMap(col), col)
            newTable.Columns.Add(colName, GetType(String))
        Next

        For Each row As DataRow In dt.Rows
            Dim newRow = newTable.NewRow()
            For i = 0 To orderedCols.Count - 1
                newRow(i) = row(orderedCols(i)).ToString()
            Next
            newTable.Rows.Add(newRow)
        Next

        Dim fileName = $"export_{DateTime.Now:yyyyMMdd_HHmmss}" & If(format.ToUpper() = "CSV", ".csv", ".json")
        Dim tempPath = Path.Combine(Path.GetTempPath(), fileName)

        If format.ToUpper() = "CSV" Then
            Using writer As New StreamWriter(tempPath)
                writer.WriteLine(String.Join(",", newTable.Columns.Cast(Of DataColumn)().Select(Function(c) c.ColumnName)))
                For Each r As DataRow In newTable.Rows
                    Dim fields = new List(Of String)()
                    For Each c As DataColumn In newTable.Columns
                        Dim val = r(c.ColumnName).ToString().Replace("\"" , "\"\"")
                        fields.Add($"""{val}""")
                    Next
                    writer.WriteLine(String.Join(",", fields))
                Next
            End Using
        Else
            Using fs As New FileStream(tempPath, FileMode.Create)
                JsonSerializer.Serialize(fs, newTable, New JsonSerializerOptions With {.WriteIndented = True})
            End Using
        End If

        UploadFile(tempPath, fileName)
        File.Delete(tempPath)
    End Sub

    Private Sub UploadFile(localPath As String, remoteFileName As String)
        Dim host = System.Configuration.ConfigurationManager.AppSettings("SftpHost")
        Dim port = Integer.Parse(System.Configuration.ConfigurationManager.AppSettings("SftpPort"))
        Dim user = System.Configuration.ConfigurationManager.AppSettings("SftpUser")
        Dim pwd = System.Configuration.ConfigurationManager.AppSettings("SftpPassword")
        Dim remotePath = System.Configuration.ConfigurationManager.AppSettings("SftpPath")

        Using client As New SftpClient(host, port, user, pwd)
            client.Connect()
            Using fs As New FileStream(localPath, FileMode.Open)
                client.UploadFile(fs, Path.Combine(remotePath, remoteFileName))
            End Using
            client.Disconnect()
        End Using
    End Sub

    Protected Overrides Sub OnStop()
        If _timer IsNot Nothing Then
            _timer.Stop()
            _timer.Dispose()
        End If
        EventLog.WriteEntry("Service stopped.")
    End Sub

    Public Shared Sub Main()
        Run(New ServiceRunner())
    End Sub
End Class
