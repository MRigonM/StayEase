using System.Runtime.Serialization;

namespace StayEase.Domain.Entities
{
    public enum BookingStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,

        [EnumMember(Value = "PaymentReceived")]
        PaymentReceived,

        [EnumMember(Value = "PaymentFailded")]
        PaymentFailded,

        [EnumMember(Value = "Canceled")]
        Canceled
    }
}
