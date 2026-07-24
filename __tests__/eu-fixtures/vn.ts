// AUTO-GENERATED from research sub-agent corpus (samples-vn.json).
import type { EuSample } from "./types";

export const vnSamples: EuSample[] = [
  {
    "input": "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "123",
    "street": "Lê Lợi",
    "type": "Đường",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "56 Nguyễn Huệ, Bến Nghé, Quận 1",
    "__skip": "markerless ward ('Bến Nghé' without a Phường/Xã marker) is indistinguishable from the last word of a two-word street name; dropping it would also split names like 'Nguyễn Huệ'. Only marked wards are dropped. With the marker ('..., Phường Bến Nghé, Quận 1') this parses cleanly."
  },
  {
    "input": "25/7 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "25/7",
    "street": "Hai Bà Trưng",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "12A Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
    "number": "12",
    "civic_number_suffix": "A",
    "street": "Nguyễn Thị Minh Khai",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "45",
    "street": "Lê Duẩn",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "200 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh",
    "number": "200",
    "street": "Nguyễn Văn Cừ",
    "type": "Đường",
    "city": "Quận 5",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "78 Cách Mạng Tháng Tám, Phường 6, Quận 3, TP. Hồ Chí Minh",
    "number": "78",
    "street": "Cách Mạng Tháng Tám",
    "city": "Quận 3",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "15 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "15",
    "street": "Đồng Khởi",
    "type": "Đường",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "15 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
    "number": "15",
    "street": "Huế",
    "type": "Phố",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "1 Phố Tràng Tiền, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
    "number": "1",
    "street": "Tràng Tiền",
    "type": "Phố",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "88 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội",
    "number": "88",
    "street": "Láng",
    "type": "Đường",
    "city": "Quận Đống Đa",
    "state": "Hà Nội"
  },
  {
    "input": "30 Bà Triệu, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
    "number": "30",
    "street": "Bà Triệu",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "10 Đại lộ Thăng Long, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
    "number": "10",
    "street": "Thăng Long",
    "type": "Đại lộ",
    "city": "Quận Nam Từ Liêm",
    "state": "Hà Nội"
  },
  {
    "input": "20 Tỉnh lộ 8, Xã Tân Thông Hội, Huyện Củ Chi, TP. Hồ Chí Minh",
    "number": "20",
    "street": "Tỉnh lộ 8",
    "city": "Huyện Củ Chi",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "5 Nguyễn Trãi, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh",
    "number": "5",
    "street": "Nguyễn Trãi",
    "city": "Huyện Bình Chánh",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "12 Đường số 7, Xã Phong Phú, Huyện Bình Chánh, TP. Hồ Chí Minh",
    "number": "12",
    "street": "số 7",
    "type": "Đường",
    "city": "Huyện Bình Chánh",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "36 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng",
    "number": "36",
    "street": "Bạch Đằng",
    "city": "Quận Hải Châu",
    "state": "Đà Nẵng"
  },
  {
    "input": "100 Đường 30 Tháng 4, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ",
    "number": "100",
    "street": "30 Tháng 4",
    "type": "Đường",
    "city": "Quận Ninh Kiều",
    "state": "Cần Thơ"
  },
  {
    "input": "8 Trần Phú, Phường Lộc Thọ, Nha Trang, Khánh Hòa",
    "number": "8",
    "street": "Trần Phú",
    "city": "Nha Trang",
    "state": "Khánh Hòa"
  },
  {
    "input": "22 Lê Lợi, Phường Vĩnh Ninh, Thành phố Huế, Thừa Thiên Huế",
    "number": "22",
    "street": "Lê Lợi",
    "city": "Thành phố Huế",
    "state": "Thừa Thiên Huế"
  },
  {
    "input": "123 Đường Lê Lợi, 700000, Quận 1, TP. Hồ Chí Minh",
    "number": "123",
    "street": "Lê Lợi",
    "type": "Đường",
    "postal_code": "700000",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "56 Nguyễn Huệ, Phường Bến Nghé, 700000, Quận 1, TP. Hồ Chí Minh",
    "number": "56",
    "street": "Nguyễn Huệ",
    "postal_code": "700000",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "45 Lê Lợi, 700000 Quận 5, TP. Hồ Chí Minh",
    "number": "45",
    "street": "Lê Lợi",
    "postal_code": "700000",
    "city": "Quận 5",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "12/3A Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
    "number": "12/3A",
    "street": "Nguyễn Đình Chiểu",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "5B Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "5",
    "civic_number_suffix": "B",
    "street": "Tôn Đức Thắng",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "17 Lê Duẩn, Tầng 5, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "17",
    "street": "Lê Duẩn",
    "sec_unit_type": "Tầng",
    "sec_unit_num": "5",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "9 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "9",
    "street": "Pasteur",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "3 Alexandre de Rhodes, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "3",
    "street": "Alexandre de Rhodes",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "250 Hai Bà Trưng, Phường Tân Định, Quận 1, TP. Hồ Chí Minh",
    "number": "250",
    "street": "Hai Bà Trưng",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "14 Phạm Ngọc Thạch, Phường 6, Quận 3, TP. Hồ Chí Minh",
    "number": "14",
    "street": "Phạm Ngọc Thạch",
    "city": "Quận 3",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "70 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    "number": "70",
    "street": "Nguyễn Huệ",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "5 Lê Lợi, Quận Hoàn Kiếm, Hà Nội",
    "number": "5",
    "street": "Lê Lợi",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "9 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "9",
    "street": "Lê Thánh Tôn",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "60 Trường Chinh, Phường 12, Quận Tân Bình, TP. Hồ Chí Minh",
    "number": "60",
    "street": "Trường Chinh",
    "city": "Quận Tân Bình",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "27 Nguyễn Huệ, Phường Bến Nghé, Quận 1",
    "number": "27",
    "street": "Nguyễn Huệ",
    "city": "Quận 1"
  },
  {
    "input": "5 Đường 3 Tháng 2, Phường 11, Quận 10, TP. Hồ Chí Minh",
    "number": "5",
    "street": "3 Tháng 2",
    "type": "Đường",
    "city": "Quận 10",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "19 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
    "number": "19",
    "street": "Đinh Tiên Hoàng",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "40 Lý Thường Kiệt, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội",
    "number": "40",
    "street": "Lý Thường Kiệt",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "11 Ngô Quyền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
    "number": "11",
    "street": "Ngô Quyền",
    "city": "Quận Hoàn Kiếm",
    "state": "Hà Nội"
  },
  {
    "input": "300 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội",
    "number": "300",
    "street": "Bà Triệu",
    "city": "Quận Hai Bà Trưng",
    "state": "Hà Nội"
  },
  {
    "input": "6 Đường Nguyễn Huệ, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    "number": "6",
    "street": "Nguyễn Huệ",
    "type": "Đường",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "2 Công Trường Lam Sơn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "number": "2",
    "street": "Công Trường Lam Sơn",
    "city": "Quận 1",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "155 Hai Bà Trưng, Phường 6, Quận 3, TP. Hồ Chí Minh",
    "number": "155",
    "street": "Hai Bà Trưng",
    "city": "Quận 3",
    "state": "TP. Hồ Chí Minh"
  },
  {
    "input": "45 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
    "number": "45",
    "street": "Võ Văn Tần",
    "city": "Quận 3",
    "state": "TP. Hồ Chí Minh"
  }
];
