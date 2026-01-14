"use client";

import React, { useState } from 'react';
import {
  Home, Mail, ChevronDown, User, Phone, ArrowLeft,
  AlertCircle, CheckCircle2, MapPin, Calendar, X, Search, Clock, KeyRound
} from 'lucide-react';

// Dữ liệu mẫu cho tính năng Tra cứu
const MOCK_BOOKINGS = [
  { id: 1, roomType: 'Phòng Standard (6 người)', date: '2025-12-17', time: '19:00', duration: '2 Giờ' },
  { id: 2, roomType: 'Phòng VIP (10 người)', date: '2025-12-18', time: '20:00', duration: '1 Giờ' },
];

export default function BookingPage() {
  // --- STATE CHÍNH ---
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [errorMessage, setErrorMessage] = useState("");

  // --- STATE THÔNG TIN ĐẶT PHÒNG ---
  const [roomType, setRoomType] = useState("Phòng Standard (6 người)");
  // 1. Thêm State cho Ngày và Giờ
  const [date, setDate] = useState("2025-12-17");
  const [startTime, setStartTime] = useState("19:00");

  // --- STATE TRA CỨU ---
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupStep, setLookupStep] = useState(1);
  const [lookupPhone, setLookupPhone] = useState("");
  const [myBookings, setMyBookings] = useState(MOCK_BOOKINGS);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  // --- LOGIC FORM CHÍNH ---

  const handleNextStep = () => {
    // Kiểm tra logic phòng Standard
    if (roomType.includes("Standard")) {
      setErrorMessage("Không có phòng khả dụng tại thời điểm đặt, vui lòng chọn loại khác");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setStep(2);
    setErrorMessage("");
  };

  const handleBackStep = () => { setStep(1); setErrorMessage(""); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBooking = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      setErrorMessage("Vui lòng điền đầy đủ Họ tên và Số điện thoại");
      return;
    }
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setCustomerInfo({ name: '', phone: '' });
    setRoomType("Phòng Standard (6 người)");
    setDate("2025-12-17"); // Reset ngày
    setStartTime("19:00"); // Reset giờ
  };

  // --- LOGIC TRA CỨU & HUỶ ---
  const openLookup = () => { setIsLookupOpen(true); setLookupStep(1); setLookupPhone(""); setOtpError(""); };
  const handleLookupSearch = () => { if (!lookupPhone) { setOtpError("Vui lòng nhập số điện thoại"); return; } setMyBookings(MOCK_BOOKINGS); setLookupStep(2); setOtpError(""); };
  const requestCancel = (id: number) => { setBookingToDelete(id); setLookupStep(3); setOtpCode(""); setOtpError(""); };
  const verifyOtpAndCancel = () => {
    if (otpCode === "123456") {
      setMyBookings(prev => prev.filter(b => b.id !== bookingToDelete));
      setLookupStep(2); setBookingToDelete(null); alert("Huỷ phòng thành công!");
    } else { setOtpError("Mã OTP không đúng (123456)"); }
  };

  return (
      <div className="min-h-screen flex font-sans bg-white relative">

        {/* POPUP TRA CỨU */}
        {isLookupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg flex items-center"><Search className="mr-2" size={20}/> Tra cứu đặt phòng</h3>
                  <button onClick={() => setIsLookupOpen(false)} className="hover:bg-purple-700 p-1 rounded-full transition"><X size={24} /></button>
                </div>
                <div className="p-6">
                  {lookupStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-black text-sm">Nhập số điện thoại bạn đã dùng để đặt phòng:</p>
                        <div className="relative"><input type="tel" value={lookupPhone} onChange={(e) => setLookupPhone(e.target.value)} placeholder="Số điện thoại..." className="w-full border text-black border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 outline-none"/><Phone className="absolute left-3 top-3.5 text-black" size={18}/></div>
                        {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                        <button onClick={handleLookupSearch} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition">Tìm kiếm</button>
                      </div>
                  )}
                  {lookupStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-gray-500">Kết quả cho: {lookupPhone}</span><button onClick={() => setLookupStep(1)} className="text-xs text-purple-600 hover:underline">Thay đổi SĐT</button></div>
                        {myBookings.length === 0 ? <div className="text-center py-8 text-black border border-dashed rounded-lg">Không tìm thấy phòng nào.</div> : <div className="space-y-3 max-h-[300px] overflow-y-auto">{myBookings.map((booking) => (<div key={booking.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-gray-50 hover:bg-purple-50 transition group"><div><p className="font-bold text-gray-800 text-sm">{booking.roomType}</p><div className="text-xs text-gray-500 mt-1 flex items-center space-x-3"><span className="flex items-center"><Calendar size={12} className="mr-1"/> {booking.date}</span><span className="flex items-center"><Clock size={12} className="mr-1"/> {booking.time} ({booking.duration})</span></div></div><button onClick={() => requestCancel(booking.id)} title="Huỷ phòng này" className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-1.5 rounded-full transition"><X size={18} /></button></div>))}</div>}
                      </div>
                  )}
                  {lookupStep === 3 && (
                      <div className="space-y-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 mb-2"><KeyRound size={24} /></div>
                        <h4 className="font-bold text-gray-800">Xác thực OTP</h4>
                        <p className="text-sm text-gray-500 px-4">Mã xác thực đã gửi về số điện thoại.<br/><span className="text-xs text-gray-400"></span></p>
                        <div className="py-2"><input type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="------" className="w-full text-center text-2xl tracking-[0.5em] text-black border border-gray-300 rounded-lg p-3 focus:border-purple-500 outline-none font-mono"/></div>
                        {otpError && <div className="bg-red-50 text-red-600 text-sm p-2 rounded flex items-center justify-center"><AlertCircle size={14} className="mr-1"/> {otpError}</div>}
                        <div className="flex space-x-3 mt-4"><button onClick={() => setLookupStep(2)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition">Quay lại</button><button onClick={verifyOtpAndCancel} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition shadow-lg shadow-red-200">Xác nhận Huỷ</button></div>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}

        {/* BACKGROUND */}
        <div className="hidden md:flex w-1/3 bg-gray-900 relative flex-col justify-end p-8 overflow-hidden">
          <img src="/R.jpg" alt="Karaoke Background" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="relative z-10 bg-black/60 backdrop-blur-sm p-6 rounded-xl text-white border border-white/10">
            <h1 className="text-4xl font-black text-yellow-400 mb-4 tracking-wider">HỒN<span className="text-white">G</span> <span className="text-yellow-400">NH</span>ÂN 3</h1>
            <p className="text-sm mb-4 leading-relaxed text-gray-200">Điểm đến giải trí hàng đầu với âm thanh ánh sáng đẳng cấp.</p>
            <div className="flex items-center space-x-2 text-sm text-gray-300"><Mail size={16} /><span>23t1020@husc.edu.vn</span></div>
          </div>
        </div>

        {/* MAIN FORM */}
        <div className="flex-1 flex flex-col p-4 md:p-12 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <div className="bg-purple-600 text-white p-1 rounded-full"><Home size={20} /></div>
              <span className="text-purple-900">/ Đặt phòng trực tuyến</span>
            </div>
            {step !== 3 && (
                <button onClick={openLookup} className="hidden sm:flex items-center border border-purple-400 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 transition text-sm font-medium">
                  <Search size={16} className="mr-2"/> Tra cứu
                </button>
            )}
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center mb-10 text-sm">
            <div className={`flex items-center font-semibold transition-colors ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step > 1 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}> {step > 1 ? <CheckCircle2 size={16}/> : '1'} </span>
              <span className="hidden sm:inline">CHỌN PHÒNG</span>
            </div>
            <div className={`flex-1 h-px mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center font-semibold transition-colors ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step > 2 ? 'bg-green-500 text-white' : (step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500')}`}> {step > 2 ? <CheckCircle2 size={16}/> : '2'} </span>
              <span className="hidden sm:inline">LIÊN LẠC</span>
            </div>
            <div className={`flex-1 h-px mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center font-semibold transition-colors ${step === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}> 3 </span>
              <span className="hidden sm:inline">HOÀN TẤT</span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white mb-auto relative min-h-[400px]">
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-300">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Cơ sở</label>
                    <div className="flex items-center p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"><MapPin size={18} className="mr-2 text-gray-500"/> Nguyễn Huệ</div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Loại phòng</label>
                    <div className="relative">
                      <select
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Phòng Standard (6 người)">Phòng Standard (6 người)</option>
                        <option value="Phòng VIP (10 người)">Phòng VIP (10 người)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Ngày đặt</label>
                    {/* 2. CẬP NHẬT INPUT NGÀY ĐỂ DÙNG STATE */}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Thời gian</label>
                    <div className="flex space-x-2">
                      {/* 2. CẬP NHẬT SELECT GIỜ ĐỂ DÙNG STATE */}
                      <select
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-1/2 border border-gray-300 rounded-md p-3 text-gray-700"
                      >
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                      </select>
                      <select className="w-1/2 border border-gray-300 rounded-md p-3 text-gray-700"><option>2 Giờ</option><option>3 Giờ</option></select>
                    </div>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Họ và tên <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" name="name" value={customerInfo.name} onChange={handleInputChange} placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:ring-2 focus:ring-purple-500 outline-none"/>
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-black text-sm">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="tel" name="phone" value={customerInfo.phone} onChange={handleInputChange} placeholder="09xx xxx xxx" className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:ring-2 focus:ring-purple-500 outline-none"/>
                      <Phone className="absolute left-3 top-3 text-black" size={20} />
                    </div>
                  </div>
                </div>
            )}

            {/* 3. HIỂN THỊ THÔNG TIN CHI TIẾT Ở BƯỚC 3 */}
            {step === 3 && (
                <div className="flex flex-col items-center justify-center text-center py-4 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600"><CheckCircle2 size={48} /></div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt phòng thành công!</h2>
                  <p className="text-gray-600 mb-4">Cảm ơn <span className="font-bold text-gray-900">{customerInfo.name}</span> đã sử dụng dịch vụ.</p>

                  {/* KHỐI THÔNG TIN CHI TIẾT */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 w-full max-w-sm mb-6 text-left space-y-2 shadow-sm">
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-2 text-sm uppercase">Thông tin vé đặt</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phòng:</span>
                      <span className="font-semibold text-gray-800">{roomType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ngày hát:</span>
                      <span className="font-semibold text-gray-800">{date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Giờ bắt đầu:</span>
                      <span className="font-semibold text-gray-800">{startTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SĐT Liên hệ:</span>
                      <span className="font-semibold text-gray-800">{customerInfo.phone}</span>
                    </div>
                  </div>

                  <button onClick={handleReset} className="text-purple-600 font-semibold hover:underline">Đặt thêm phòng khác</button>
                </div>
            )}
          </div>

          {step !== 3 && (
              <div className="bg-gray-50 -mx-4 -mb-4 md:-mx-12 md:-mb-12 mt-8 p-6 border-t border-gray-100 flex flex-col">
                {errorMessage && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-center rounded-r animate-pulse">
                      <AlertCircle size={20} className="mr-2" /><span className="font-medium">{errorMessage}</span>
                    </div>
                )}
                <div className="flex justify-between items-center w-full">
                  {step === 2 ? (
                      <button onClick={handleBackStep} className="flex items-center text-gray-600 hover:text-black font-medium px-4 py-2 hover:bg-gray-200 rounded transition">
                        <ArrowLeft size={18} className="mr-2" /> Quay lại
                      </button>
                  ) : (
                      <div></div>
                  )}
                  <button onClick={step === 1 ? handleNextStep : handleBooking} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:-translate-y-0.5">
                    {step === 1 ? "Tiếp tục" : "Xác nhận đặt"}
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}