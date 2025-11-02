- Với bộ dự liệu thứ 2 mà chúng tôi thực hiện được dựa trên https://aimi.stanford.edu/datasets/chexpert-chest-x-rays được ứng dụng vào 4 mô hình CNN, Resnet50,xceptionnet,Efficientnet
<img width="1280" height="691" alt="image" src="https://github.com/user-attachments/assets/b85b951d-736e-4461-9997-e8687b2a06b8" />

- Để có thể dữ liệu được đảm bảo trong tình trạng tốt thì chúng tôi đã có vài phương pháp lọc qua bằng công nghệ riêng và người có chuyên môn giúp đỡ https://drive.google.com/file/d/1YsAd3e9WOaCFXJLcIlnfHpxlisds_vmt/view?usp=sharing và cả đường dẫn hình ảnh đã được chúng tôi ghi nhận những trường hợp viêm phổi do viêm khuẩn xâm hại và virus, và những ca bệnh bình thường bằng công Grad-cam
<img width="1155" height="801" alt="image" src="https://github.com/user-attachments/assets/00858ea4-fb9c-4fff-a2cd-0d5fce178c86" />

- Đồng thời để có thể đưa ra kết quả mô hình với độ chính xác cao nhất thì chúng tôi đã cải thiện và cập nhập thêm tính năng xác thực chéo (cross-validation) cho 4 mô hình mỗi mô hình để khắc phục tình trạng kết quả phụ thuộc vào cách chia dữ liệu
- Fold
Dùng để train
Dùng để validation
Test
Fold 1
80% Train+Val
20% Train+Val
100% Test
Fold 2
80% Train+Val
20% Train+Val
100% Test
Fold 3
80% Train+Val
20% Train+Val
100% Test
Fold 4
80% Train+Val
20% Train+Val
100% Test
Fold 5
80% Train+Val
20% Train+Val
100% Test


 
