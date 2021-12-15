TÌM HIỂU VỀ MODULE BUNDLER ----

code cần phải được optimize: minify, uglyfy, unused code
new syntax is not support on browser

--> Task runner (Grunt, gulp) or Module bundler (webpack, rollup, parcel là nhiều nhất)

- Task runner: định nghĩa ra từng task -> tái sử dụng task
- Module bundler: có default options để run task. Tính năng: code transformanation, tree shaking (loại bỏ những hàm code không sử dụng), hot module replacement (replace 1 module khi thay đổi module đó, không cập nhật lại tấc cả, tốn thời gian)

bundle là việc đóng gói lại app sau khi cập nhật source code

Sơ đồ đường đi của post-ui-project

<!-- Public folder -->

--> tạo ra folder public thì khi build sẽ copy các phần tử trong đó quan dist, easy
--> CDN: content delivery network: mạng lưới cache server trên toàn cầu
