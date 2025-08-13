using AutoMapper;
using Microsoft.AspNetCore.Identity;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects;
using StayEase.Domain.DataTransferObjects.Booking;
using StayEase.Domain.Entities;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services;
using StayEase.Infrastructure.Specifications;

namespace StayEase.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IPaymentService _paymentService;

        public BookService(IUnitOfWork unitOfWork, UserManager<AppUser> userManager, IMapper mapper, IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            _paymentService = paymentService;
        }

        public async Task<Responses> CreateBookingByPropertyId(string email, BookingToCreateDTO bookDTO)
        {
            var property = await _unitOfWork.Repository<Property, string>().GetByIdAsync(bookDTO.PropertyId);
            if (property == null) return await Responses.FailurResponse("Property not found!");

            bool isAvailable = await _unitOfWork.Repository<Booking, int>().CheckAvailabilityAsync(b => b.PropertyId == property.Id, bookDTO.StartDate, bookDTO.EndDate);
            if(!isAvailable) return await Responses.FailurResponse("please check another date, property isn't availabe at this time!");

            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return await Responses.FailurResponse("please login to proccess!");

            var totalPrice = (bookDTO.EndDate.Day - bookDTO.StartDate.Day) * property.NightPrice;

             //var intent = await _paymentService.CreatePaymentIntent(totalPrice, "usd", );

             var booking = new Booking
             {
                 PropertyId = property.Id,
                 StartDate = bookDTO.StartDate,
                 EndDate = bookDTO.EndDate,
                 TotalPrice = totalPrice,
                 UserId = user.Id,
                 PaymentDate = DateTime.Now,
                 PaymentMethod = "card",
             };

            await _unitOfWork.Repository<Booking, int>().AddAsync(booking);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while booking the property!");

            return await Responses.SuccessResponse("Property has been booked successfully!");
        }

        public async Task<Responses> DeleteBookingById(int bookingId)
        {
            throw new NotImplementedException();
        }

        public async Task<Responses> GetBookingById(int bookingId)
        {
            throw new NotImplementedException();
        }
        
        public async Task<Responses> GetBookingsByUserId(string email)
        {
            throw new NotImplementedException();
        }
        
        public async Task<Responses> UpdateBookingByPropertyId(int bookingId, BookingToUpdateDTO bookDTO)
        {
            throw new NotImplementedException();
        }
    }
}
