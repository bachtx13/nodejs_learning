# Authentication

- Mật khẩu phải được mã hóa (1 chiều)
- 2 cách:

* encrypt: md5, sha1 --> Không an toàn
* hash: bcrypt --> An toàn hơn

## Session-Based

- Verify email và password
- Lấy thông tin user
- Lưu vào session

## Token-Based

==> Học ở phần API

- Verify email và password
- Lấy thông tin user
- Lưu vào token (JWT)

# Đăng nhập mạng xã hội

## Database

users

- id
- name
- email
- password
- provider_id

providers

- id
- name: facebook|google|email|github

## Flow

- OpenId hoặc OAuth
