using StayEase.Domain.DataTransferObjects;
using FluentValidation;

namespace StayEase.APIs.Validators
{
    public class ForgetPasswordValidation:AbstractValidator<ForgetPasswordDto>
    {
        public ForgetPasswordValidation()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }
}
