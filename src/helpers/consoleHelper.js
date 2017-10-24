import beeSeat from '../assets/img/beeSeat.png'

export const noticeHack = function () {
  (process.env.NODE_ENV === 'production') && console.clear();

  console.log('');
  console.log(
    "%c Đừng nghe những gì hacker nói ",
    //`background: #007aff; color: white; font-size: x-large; padding: 10px`
    `background: url('${beeSeat}') no-repeat #007aff; color: white; font-size: x-large; padding: 10px 10px 10px 30px`
  );
  console.log('');
  console.log(
    `%c Bạn đang truy cập tính năng chỉ dành cho lập trình viên, bất cứ ai bảo bạn chạy lệnh gì ở vùng này đều có thể ăn cắp tài khoản và thông tin của bạn. Cẩn thận nhé.`,
    `background: white; color: #007aff; font-size: normal; padding: 4px; line-height:1.6; font-weight: bold`
  );
}
