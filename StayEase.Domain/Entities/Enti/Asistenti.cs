using System.ComponentModel.DataAnnotations.Schema;

namespace StayEase.Domain.Entities.Enti;

public class Asistenti : BaseEntity<int>
{
    public string Name { get; set; }
    public string Mbiemri { get; set; }
    public string Pozita { get; set; }
    [ForeignKey("Departamenti")]
    public int DepartamentiId { get; set; }
    public string DepartamentiName { get; set; }
}