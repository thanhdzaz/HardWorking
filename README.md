# Hệ thống quản lý công việc - HardWorking

## Phạm vi dự án
    - Ứng dụng được sử dụng trong một tổ chức,công ty và không giới hạn người sử dụng.
    - Ứng dụng chủ yếu phục vụ cho việc quản lý dự án và các công việc của dự án.

## Đối tượng sử dụng
    - Quản trị hệ thống
    - Người dùng

## User story

##### US1: Đăng nhập

    - Một người dùng có thể đăng nhập qua form đăng nhập


##### US2: Quản lý người dùng

    - Quản trị hệ thống sẽ nắm vai trò tạo và quản trị người dùng cho HardWorking


##### US3: Quản lý dự án
    - Quản trị hệ thống có toàn quyền quản lý dự án và phân quyền cho người dùng
    - Người quản lý dự án có quyền quản lý dự án mà mình quản lý
##### US4: Quản lý công việc

    - Người quản lý có thể tạo ra danh sách công việc hàng ngày, hoặc tạo dự án rồi tạo danh sách công việc theo dự án, các trường thông tin của 1 công việc. 

    - Người quản lý có thể nhìn thấy danh sách công việc hàng ngày hoặc theo dự án hoặc toàn bộ theo từng nhóm hoặc cả tổ chức tuỳ theo vai trò và quyền.

    - Người quản lý có thể theo dõi tiến độ của từng nhóm hay dự án hay theo từng thành viên theo ngày, theo tuần, theo sprint, hoặc theo tháng.

##### US5: Danh sách việc làm

    - Một thành viên trong tổ chức khi vào trang danh sách công việc thì nhìn thấy danh sách công việc cần làm tại thời điểm đó, hoặc tất cả công việc tuỳ theo bộ lọc. Danh sách công việc có thể hiển thị theo các khung nhìn khác nhau: dạng list, dang kaban, dang giant, dạng lịch

##### US6: Tương tác với 1 công việc

    - Như là 1 người dùng, khi xem chi tiết một công việc, có thể cập nhật số giờ làm việc cho công việc đó, có thể thêm các ghi chú, thêm ảnh, video; có thể thao tác bắt đầu, cập nhật tiến độ, hoàn thành.

##### US7: Thảo luận trong 1 công việc

    - Thảo luận trong 1 công việc: khi thảo luận có thể tag 1 thành viên khác, khi được tag thì thành viên sẽ nhận được thông báo qua mail, qua web notify

### Chức năng
- Admin: 
	- Đăng nhập
	- Đăng xuất
	- Quản lý người dùng
	- Quản lý vai trò
	- Quản lý dự án
	- Quản lý công việc
	- Xin nghỉ
- Người dùng
	- Đăng nhập
	- Đăng xuẩt
	- Quản lý công việc
	- Chấm công
	- Xin nghỉ

#### [Cấu trúc database](https://dbdesigner.page.link/xT4EXJ7DvbBqEsq47)
    .
    ├── Users
    ├── Project
    ├── Task
    ├── UserProject
    ├── Role
    └── Comment
    
    DB link

#### Hướng đẫn chạy

Sau khi clone project chạy lệnh:


```sh
yarn && yarn start
```

#### Build project

```sh
yarn build
```

#### Công nghệ sử dụng

* [React](https://reactjs.org/) - Thư viện JavaScript hỗ trợ xây dựng UI
* [Typescript](https://www.typescriptlang.org/) - Phương thức và kiểu mẫu code
* [Mobx](https://mobx.js.org/) - Thư viện quản lý state
* [AntDesign](https://ant.design/) - Một thư viện UI gồm các mảnh giao diện dựng sẵn.
