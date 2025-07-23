using Microsoft.AspNetCore.Http;
using StayEase.Application.Utility;

namespace StayEase.Application.Settings;

public static class DocumentSettings
{
    public static async Task<string> UploadFile(IFormFile file, string fileCategory, string folderName)
    {
        string current = Directory.GetCurrentDirectory();
        string fileName = $"{Guid.NewGuid()}{file.FileName}";

        string fullFilePath= Path.Combine(current,SD.wwwroot, SD.Files, fileCategory, folderName, fileName);
        string subFilePath = Path.Combine(SD.Files, fileCategory, folderName, fileName).Replace('\\','/');

        // Save File As Streem
        var FileStreem = new FileStream(fullFilePath, FileMode.Create);
        file.CopyTo(FileStreem);
        FileStreem.Close();
        // return File name
        return subFilePath;
    }
    // Delete File
    public static async Task DeleteFile(string fileCategory,string folderName,string fileName)
    {
        string current = Directory.GetCurrentDirectory();
        string filePath = Path.Combine(current,SD.wwwroot,SD.Files, fileCategory, folderName, fileName);
        if(File.Exists(filePath))
        {
            File.Delete(filePath);
        }
        return;
    }

}