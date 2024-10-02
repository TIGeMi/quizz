function removeLeadingDigits(line) {
  const digitRegex = /^\d+\s{2}/; // Matches one or more digits followed by exactly two spaces
  return line.replace(digitRegex, '');
}

function convertTextToJSON(text) {
  // "question", "answer"
  const lineInfos = [];
  const questions = [];
  const corrects = [4, 4, 3, 1, 4, 3, 4, 3, 4, 4, 3, 1, 2, 3, 4, 3, 4, 3, 4, 4, 4, 4, 4, 3, 4, 4, 4, 1, 4, 4, 3, 4, 4, 2, 1, 4, 3, 4, 3, 1, 1, 2, 4, 4, 1, 4, 2, 2, 1, 4, 4, 4, 1, 3, 2, 1, 1, 2, 2, 4, 4, 1, 2, 4, 2, 3, 1, 2, 3, 4, 1, 1, 4, 2, 4, 1, 4, 4, 4, 4, 1, 1, 1, 3, 1, 2, 4, 3, 4, 3, 1, 2, 4, 3, 4, 2, 1, 4, 1, 4, 2, 3, 3, 1, 4, 4, 2, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 4, 2, 4, 4, 4, 1, 3, 2, 1, 2, 3, 3, 1, 2, 4, 4, 4, 3, 4, 4, 1, 1, 3, 2, 4, 4, 4, 3, 3, 3, 4, 2, 3, 1, 2, 4, 2, 4, 1, 1, 4, 4, 3, 2, 4, 4, 1, 4, 3, 2, 1, 4, 4, 4, 4, 2, 1, 4, 3, 4, 3, 3, 2, 4, 2, 2, 3, 4, 3, 3, 1, 4, 3, 4, 1, 2, 3, 1, 3, 1, 1, 3, 4, 2, 2, 4, 2, 3, 2, 1, 4, 4, 4, 3, 3, 3, 3, 4, 2, 1, 4, 4, 2, 3, 4, 1, 2, 1, 1, 3, 2, 1, 3, 3, 4, 3, 4, 2, 4, 1, 1, 4, 4, 1, 3, 2, 2, 3, 4, 1, 4, 4, 4, 2, 4, 4, 2, 1, 3, 1, 1, 3, 4, 3, 4, 1, 4, 1, 3, 2, 4, 2, 1, 4, 2, 2, 3, 4, 1, 4, 3, 1, 3, 2, 1, 2, 2, 2, 4, 1, 4, 4, 3, 2, 1, 2, 4, 1, 1, 4, 3, 3, 4, 2, 2, 3, 3, 1, 4, 4, 3, 1, 1, 4, 3, 4, 1, 1, 1, 4, 2, 1, 4, 3, 3, 3, 2, 4, 4, 4, 4, 4, 3, 2, 4, 3, 4, 1, 1, 4, 4, 4, 4, 4, 1, 4, 3, 2, 4, 3, 3, 2, 2, 3, 4, 2, 4, 4, 3, 3, 1, 3, 4, 4, 4, 1, 4, 4, 3, 3, 3, 4, 3, 4, 4, 3, 4, 3, 3, 4, 4, 4, 3, 4, 4, 2, 4, 4, 3, 2, 4, 4, 1, 4, 4, 1, 3, 1, 4, 4, 1, 3, 2, 4, 2, 1, 3, 1, 4, 1, 1, 4, 1, 3, 3, 1, 3, 4, 4, 2, 1, 4, 4, 3, 3, 2, 2, 1, 4, 4, 1, 1, 1, 3, 2, 1, 4, 2, 4, 1, 4, 4, 4, 3, 3, 3, 2, 1, 3, 2, 2, 2, 4, 4, 2, 4, 3, 3, 3, 4, 4, 3, 2, 3, 4, 1, 2, 2, 2, 2, 1, 2, 4, 2, 2, 2, 4, 2, 2, 2, 2, 1, 4, 4, 2, 2, 3, 4, 4, 4, 4, 4, 3, 3, 1, 3, 4, 4, 4, 1, 4, 1, 1, 3, 1, 4, 2, 3, 3, 1, 2, 1, 3, 2, 2, 2, 2, 4, 1, 2, 2, 4, 1, 2, 2, 4, 2, 2, 2, 3, 1, 4, 1, 2, 1, 1, 2, 3, 3, 3, 4];
  let currentQuestion = {};

  const lines = text.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = lines[lineIndex]
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      lineInfos[lineIndex] = ""
      continue; // Skip empty lines
    }

    line = removeLeadingDigits(line.trim()).trim()

    // Check for question code and question text
    const match = line.match(/^(\d+\.\w{3}) - (.*)/);
    if (match) {
      if (currentQuestion.code) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        code: match[1],
        question: match[2],
        questionType: "text",
        answerSelectionType: "single",
        answers: [],
        correctAnswer: `${corrects[questions.length]}`,
        messageForCorrectAnswer: "Correct answer. Good job.",
        messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      };
      lineInfos[lineIndex] = "question"
    } else {
      // Check for answer
      const cleanLine = removeLeadingDigits(line.trim()).trim();
      const isContinuation = !cleanLine.startsWith("A. ") && !cleanLine.startsWith("B. ") && !cleanLine.startsWith("C. ") && !cleanLine.startsWith("D. ")

      if (isContinuation) {
        if (lineInfos[lineIndex - 1] === "question") {
          currentQuestion.question += ` ${cleanLine}`;
          lineInfos[lineIndex] = "question"
        }
        else if (lineInfos[lineIndex - 1] === "answer") {
          currentQuestion.answers[currentQuestion.answers.length - 1] += ` ${cleanLine}`;
          lineInfos[lineIndex] = "answer"
        }
      }
      else {
        currentQuestion.answers.push(cleanLine);
        lineInfos[lineIndex] = "answer"
      }
    }
  }

  if (currentQuestion.code) {
    questions.push(currentQuestion);
  }

  return questions;
}

// Example usage
const textContent = `

            05.029 - KH có thể tạo mã QR và thanh toán QR PAY trên VCB DigiBiz chưa?

                     A.  KH đã có thể tạo mã QR trên VCB DigiBiz kênh App và Web

      1              B.  KH đã có thể tạo mã QR trên VCB DigiBiz kênh App

                     C.  KH chưa thể tạo mã QR và thanh toán QR PAY trên VCB DigiBiz

                     D.  KH đã có thể tạo mã QR trên VCB DigiBiz kênh App, tuy nhiên chưa thực hiện thanh toán được QR PAY

            05.085 - Khách hàng có thể sử dụng 01 số điện thoại để nhận biến động số dư tài khoản của tài khoản nào?

                     A.  Tài khoản mặc định

      2              B.  01 số tài khoản thuộc CIF

                     C.  Toàn bộ tài khoản thuộc CIF

                     D.  Tất cả các đáp án trên

            05.083 - Khách hàng có thể đăng ký VCB-SMSB@nking qua các kênh nào?

                     A.  Ngân hàng số VCB Digibank kênh Web

      3              B.  Ngân hàng số VCB Digibank kênh APP

                     C.  Tại các điểm giao dịch của Vietcombank

                     D.  Tất cả các đáp án trên

            05.087 - Khách hàng có thể nhắn tin theo cú pháp để nạp tiền điện thoại cho:

                     A.  Nạp tiền cho chính thuê bao đang yêu cầu dịch vụ của khách hàng

      4              B.  Nạp tiền cho thuê bao di động khác thuộc các mạng được Vietcombank cho phép

                     C.  Nạp tiền cho các số điện thoại của khách hàng đã đăng ký tại VCB

                     D.  Tất cả các đáp án trên

            05.082 - Khi tiếp cận chào bán dịch vụ thanh toán số cho đơn vị cung cấp hàng hóa, dịch vụ trên kênh bán
            hàng trực tuyến của đơn vị, CN có thể chào bán các giải pháp thanh toán số nào sau đây?

                     A.  Thanh toán qua mã QRCode, thanh toán thẻ nội địa và thẻ quốc tế.

      5              B.  Thanh toán sử dụng giải pháp Tokenization (cho phép lưu thông tin thẻ của Khách hàng tại ứng dụng
                         của ĐVCNTT để thuận tiện cho Khách hàng khi sử dụng thanh toán lần sau và vẫn đảm bảo an toàn,
                         bảo mật theo chuẩn quốc tế).

                     C.  Thanh toán ApplePay.

                     D.  Tất cả đáp án trên đều đúng

            05.026 - Số lượng mã truy cập tối đa khách hàng có thể đăng ký sử dụng cho dịch vụ VCB DigiBiz?

                      A.  Mô hình A: 1 mã quản trị, 5 mã lập lệnh Mô hình B: 1 mã quản trị, 5 mã lập lệnh, 5 mã duyệt lệnh

      6               B.  Mô hình A: 1 mã quản trị, 10 mã lập lệnh Mô hình B: 1 mã quản trị, 5 mã lập lệnh, 5 mã duyệt lệnh

                      C.  Mô hình A: 1 mã quản trị, 10 mã lập lệnh Mô hình B: 1 mã quản trị, 10 mã lập lệnh, 10 mã duyệt lệnh

                      D.  Mô hình A: 2 mã quản trị, 10 mã lập lệnh Mô hình B: 2 mã quản trị, 10 mã lập lệnh, 10 mã duyệt lệnh

            05.081 - Khi tiếp cận chào bán dịch vụ thanh toán số cho đơn vị cung cấp hàng hóa, dịch vụ tại điểm bán/cửa
             hàng, CN có thể chào bán các giải pháp thanh toán số nào sau đây?

                      A.  Thanh toán qua mã QRCode, thanh toán thẻ POS (có hỗ trợ kết nối với phần mềm bán hàng của đơn vị
                          như các chuỗi bán lẻ, siêu thị); Thanh toán ApplePay.

      7               B.  Thanh toán QR xuyên biên giới (QR UPI, QR Thái Lan) cho các Đơn vị thuộc lĩnh vực nhà hàng, khách
                          sạn tại địa bàn có nhiều khách du lịch nước ngoài.

                      C.  Giải pháp hỗ trợ Đơn vị chấp nhận thẻ đăng ký chuyển đổi trả góp cho chủ thẻ (với các lính vực có giá trị
                          thanh toán lớn như cửa hàng điện máy, thanh toán học phí,...)

                      D.  Tất cả đáp án trên đều đúng

            05.088 - Khách hàng có khoản lãi vay sẽ đến hạn thanh toán vào ngày 26 của tháng. Vậy khách hàng sẽ nhận
            tin nhắn thông báo lịch trả nợ vay vào ngày nào của tháng đó?

                      A.  Ngày 19 của tháng đó
      8
                      B.  Ngày 20 của tháng đó

                      C.  Ngày 21 của tháng đó

                      D.  Ngày 22 của tháng đó

            05.030 - Thiết bị R-ATM của VCB cung cấp các dịch vụ/ tính năng nào sau đây?

                      A.  Rút tiền qua thẻ vật lý

      9               B.  Rút tiền bằng mã QR

                      C.  Nộp tiền

                      D.  Tất cả các đáp án trên

            05.089 - Câu trả lời nào đúng nhất cho câu hỏi Mức phí sử dụng dịch vụ SMSBanking của VCB (phí chưa bao
            gồm VAT)

                      A.  Miễn phí

      10              B.  10.000 đồng/tháng/SĐT, không phân biệt số lượng tin nhắn phát sinh

                      C.  Tối đa 1.000.000 đồng/tháng/SĐT nếu số lượng tin nhắn phát sinh trong tháng trên 20 tin

                      D.  10.000 đồng/tháng/SĐT nếu số lượng tin nhắn phát sinh trong tháng dưới 20 tin và số lượng tin nhắn *
                          700đ/SMS nếu số lượng tin nhắn phát sinh từ 20 tin trở lên.

            05.080 - CN tiếp cận phát triển dịch vụ thanh toán thẻ cho đơn vị có quy mô doanh số dưới 2 tỷ đồng/năm thì
            CN tham chiếu sử dụng chính sách phí nào để áp dụng cho đơn vị?

                      A.  Chính sách phí ưu đãi cho đơn vị quy mô nhỏ theo quy định của Tổ chức thẻ quốc tế Visa và chính sách
                          phí theo loại hình kinh doanh (Merchant Category Code - MCC)
      11
                      B.  Chính sách phí theo loại hình kinh doanh (Merchant Category Code - MCC)

                      C.  Chính sách phí ưu đãi cho đơn vị quy mô nhỏ theo quy định của Tổ chức thẻ quốc tế Visa.

                      D.  Không đáp án nào đúng.

            05.023 - Nhận định nào sau đây là sai

                      A.  Chỉ KH được định danh là KHTCBL trên hệ thống VCB mới có thể đăng ký sử dụng VCB DigiBiz

      12              B.  Tất cả các KHTC đều có thể đăng ký sử dụng dịch vụ VCB DigiBiz

                      C.  Tập KH mục tiêu của VCB DigiBiz là KHTCBL, hộ kinh doanh

                      D.  Chỉ KH được định danh là KHTCBL được đăng ký gói giao dịch


            05.078 - Đơn vị chấp nhận thẻ (ĐVCNT) hiện hữu của CN có chính sách phí thấp hơn giá vốn nên để đảm bảo
             hiệu quả cho VCB, CN cần thực hiện đàm phán với ĐVCNT để điều chỉnh tăng phí theo lộ trình và mức phí
             mới cao hơn mức phí cũ (các cấu phần phí mới có thể cao hơn hoặc có cấu phần phí cao hơn, có cấu phần
             phí bằng mức phí cũ). Khi đó, quyền quyết định chính sách phí thanh toán thẻ của CN trong trường hợp
            ĐVCNT này như thế nào?

                      A.  CN không được quyền quyết định chính sách phí và cần trình Ban lãnh đạo phê duyệt (thông qua P.Phát
                          triển kênh số đối tác và Ban Khách hàng liên quan tại TSC).
      13
                      B.  CN được quyền quyết định chính sách phí trong trường hợp này với mục tiêu tạo sự chủ động cho CN
                          trong công tác rà soát tăng phí ĐVCNT để gia tăng hiệu quả kinh doanh dịch vụ cho VCB.

                      C.  CN không được quyền quyết định chính sách phí và cần trình Ban lãnh đạo phê duyệt (thông qua P.Phát
                          triển kênh số đối tác - TSC).

                      D.  CN không được quyền quyết định chính sách phí và cần trình Ban lãnh đạo phê duyệt (thông qua Ban
                          Khách hàng liên quan tại TSC)

            05.090 - Khách hàng được sử dụng bao nhiêu số điện thoại để đăng ký dịch vụ VCB-SMSB@nking cho
             KHTC?

                      A.  03 số điện thoại
      14
                      B.  05 số điện thoại

                      C.  10 số điện thoại

                      D.  Không giới hạn số lượng số điện thoại đăng ký

            05.033 - Phí nộp tiền mặt tại R-ATM hiện nay là bao nhiêu

                      A.  1.100 VNĐ

      15              B.  2.000 VNĐ

                      C.  2.200 VNĐ

                      D.  Miễn phí

            05.093 - Khách hàng tổ chức nhắn tin theo cú pháp nào đến đầu số 6167 để ngừng nhận SMS chủ động của
            Tài khoản đã đăng ký?

                      A.  VCB CD HUY
      16
                      B.  VCB CD HUY <số tài khoản>

                      C.  VCB CD HUY TK <số tài khoản>

                      D.  VCB CD HUY SMSCD

            05.077 - Chi nhánh nhận được yêu cầu kết nối triển khai giải pháp thanh toán không dùng tiền mặt cho Bệnh
            viện công tại địa bàn Chi nhánh, Chi nhánh có thể chào Bệnh viện các giải pháp thanh toán nào của VCB
            trong các giải pháp sau đây:

                      A.  Thanh toán thẻ qua POS
      17
                      B.  Thanh toán qua mã QR

                      C.  Thanh toán hóa đơn trên VCB Digibank

                      D.  Tất cả các phương thức trên

            05.099 - Khách hàng được thông báo biến động số dư tài khoản qua OTT của các tài khoản nào của khách
             hàng?

                      A.  Tài khoản mặc định đăng ký VCB Digibank
      18
                      B.  Một vài tài khoản của khách hàng

                      C.  Tất cả tài khoản thanh toán của khách hàng

                      D.  Tất cả đáp án trên đều sai

      19    05.076 - Sau khi triển khai thành công dịch vụ Thanh toán số với Đơn vị chấp nhận thanh toán (ĐVCNTT), Chi

             nhánh cần thực hiện các công việc nào trong các công việc sau đây?

                      A.  Thường xuyên theo dõi, đánh giá kết quả triển khai dịch vụ để thúc đẩy doanh số giao dịch tại ĐVCNTT.

                      B.  Thu phí, rà soát thu phí dịch vụ đúng, đầy đủ theo quy định tại Hợp đồng hợp tác với ĐVCNTT.

                      C.  Thẩm định, kiểm tra hoạt động của ĐVCNTT định kỳ theo chính sách quy định hiện hành của VCB.

                      D.  Tất cả các đáp án đều đúng

            05.021 - VCB DigiBiz được triển khai trên kênh nào

                      A.  Web

      20              B.  App

                      C.  Đã triển khai kênh Web/Wap, kênh App sẽ được triển khai trong năm 2024

                      D.  A và B

            05.075 - Trong quá trình thương thảo ký kết Hợp đồng triển khai dịch vụ Thanh toán số với Đơn vị chấp nhận
            thanh toán (ĐVCNTT) có phát sinh một số yêu cầu của ĐVCNTT điều chỉnh điều khoản liên quan đến quyền
            và trách nhiệm của các Bên tại Hợp đồng, Chi nhánh xử lý như thế nào?

                      A.  Đồng ý với các chỉnh sửa của ĐVCNTT để nhanh chóng triển khai dịch vụ.

      21              B.  Chủ động đánh giá các yêu cầu của ĐVCNTT, tiến hành giải thích, làm rõ các điều khoản tại Hợp đồng
                          và đề nghị giữ nguyên các điều khoản theo Hợp đồng mẫu của VCB.

                      C.  Liên hệ với Phòng đầu mối ban hành Hợp đồng tại Trụ sở chính đề nghị có ý kiến đánh giá với các yêu
                          cầu thay đổi của ĐVCNTT trong trường hợp ĐVCNTT yêu cầu bắt buộc phải chỉnh sửa Hợp đồng.

                      D.  B & C đều đúng

            05.035 - Số lần nộp tiền trên máy R-ATM mà KH được thực hiện trong 01 ngày?

                      A.  10 lần

      22              B.  15 lần

                      C.  20 lần

                      D.  Không giới hạn

            05.100 - Khách hàng có thể ngừng nhận OTT trên ứng dụng VCB Digibank qua những kênh nào?

                      A.  Ngân hàng số VCB Digibank kênh Web

      23              B.  Ngân hàng số VCB Digibank kênh APP

                      C.  Hotline VCB theo số 1900545413

                      D.  A và B đều đúng

            05.074 - Khách hàng là Hộ kinh doanh bán lẻ hàng thời trang có nhu cầu triển khai dịch vụ thanh toán qua mã
            QR với VCB, Chi nhánh cần làm gì để triển khai dịch vụ cho Khách hàng?

                      A.  Không triển khai do đối tượng Khách hàng có quy mô giao dịch nhỏ.

      24              B.  Ký Hợp đồng với Khách hàng và gửi Công văn về Trụ sở chính để kết nối triển khai dịch vụ cho Khách
                          hàng.

                      C.  Ký Hợp đồng với Khách hàng và thực hiện Khai báo thông tin trên hệ thống quản lý Đơn vị chấp nhận
                          thanh toán của VCB, in mã QR và triển khai dịch vụ cho Khách hàng

                      D.  Liên hệ VNPAY để hỗ trợ triển khai mã QR cho Khách hàng.

            05.101 - Lựa chọn phương án trả lời đúng nhất: VCB đang triển khai các hình thức chia sẻ biến động số dư
            (BĐSD) nào?

                      A.  Chia sẻ BĐSD theo từng tài khoản thanh toán
      25
                      B.  Chia sẻ BĐSD theo mục đích nhận tiền của QR bán hàng

                      C.  Cả A&B đều sai

                      D.  Cả A&B đều đúng

      26    05.072 - Hiện tại VCB đang triển khai thanh toán từ nguồn thẻ tín dụng cho các dịch vụ gì trên VCB Digibank?

                      A.  Dịch vụ thanh toán đặt vé máy bay (nội địa và quốc tế).

                      B.  Dịch vụ thanh toán đặt phòng khách sạn

                      C.  Dịch vụ thanh toán tại các Đơn vị chấp nhận thanh toán QR do VNPAY phát triển.

                      D.  Tất cả các đáp án trên đều đúng

            05.020 - Chức năng Quản lý tài chính cá nhân trên VCB Digibank mang lại cho KH những tiện ích gì?

                      A.  Thiết lập ngân sách

      	              B.  Theo dõi tình hình biến động thu chi trên tài khoản

                      C.  Xây dựng và quản lý mục tiêu tiết kiệm đơn giản, hiệu quả

                      D.  Cả A, B, C

            05.036 - Dịch vụ RTM liên ngân hàng tại ATM qua mã QR áp dụng cho loại QR nào

                      A.  VietQR

      28              B.  VNPayQR

                      C.  A và B đều đúng

                      D.  A và B đều sai

            05.102 - Cách thức truy cập tính năng Chia sẻ biến động số dư (BĐSD) trên ứng dụng VCB Digibank?

                      A.  Chức năng Cài đặt thông báo

      29              B.  Chức năng QR bán hàng

                      C.  Nhóm tính năng Tiện ích

                      D.  Tất cả đáp án trên đều đúng

            05.071 - Giải pháp hỗ trợ Đơn vị chấp nhận thẻ đăng ký chuyển đổi trả góp cho chủ thẻ có phạm vi trả góp
            thẻ ngân hàng nào?

                      A.  Chỉ chuyển đổi trả góp cho thẻ do VCB phát hành.

      30              B.  Chuyển đổi trả góp cho 10 ngân hàng có quan hệ hợp tác với VCB.

                      C.  Chuyển đổi trả góp cho hơn 20 ngân hàng có quan hệ hợp tác với VCB.

                      D.  Chuyển đổi trả góp cho hơn 20 ngân hàng qua đối tác Trung gian thanh toán hợp tác dịch vụ trả góp với
                          VCB

            05.112 - Khách hàng có thể chủ động tạm ngừng sử dụng thẻ đã liên kết với ví Apple theo các cách nào?

                      A.  Khóa thẻ

      31              B.  Khóa toàn bộ token của thẻ và Xóa thẻ trên ví Apple

                      C.  Khóa thẻ và Khóa toàn bộ token của thẻ và Xóa thẻ trên ví Apple

                      D.  Khóa bất kỳ token thẻ nào có tồn tại

            05.070 - Dịch vụ thanh toán số mang lại lợi ích gì cho VCB?

                      A.  Thu phí dịch vụ.

      32              B.  Lợi ích từ CASA và bán chéo các dịch vụ khác.

                      C.  Lợi ích ngoại tệ từ thẻ nước ngoài chi tiêu tại Đơn vị của VCB.

                      D.  Tất cả các đáp án đều đúng

            05.014 - Khách hàng có thể đăng ký sử dụng dịch vụ VCB Digibank tại các kênh?

                      A.  Chỉ các điểm giao dịch của VCB

                      B.  1. Các điểm giao dịch của VCB 2. Đăng ký trực tuyến trên ứng dụng VCB Digibank (chỉ áp dụng cho
      33                  Khách hàng mới)

                      C.  1. Các điểm giao dịch của VCB 2. Đăng ký qua Hotline 24/7 của VCB

                      D.  1. Các điểm giao dịch của VCB 2. Đăng ký trên ứng dụng ví VNPAY/ Momo (chỉ áp dụng cho Khách
                          hàng mới). 3. Đăng ký trực tuyến trên ứng dụng VCB Digibank (áp dụng cho Khách hàng mới và Khách
                          hàng hiện hữu thỏa mãn điều kiện)

            05.037 - Dịch vụ nào đang chưa được triển khai trên thiết bị R-ATM VCB?

                      A.  Rút tiền bằng mã QR

      34              B.  Nộp tiền bằng thẻ quốc tế

                      C.  Rút tiền bằng thẻ ngân hàng khác

                      D.  Nộp tiền bằng thẻ ghi nợ nội địa Vietcombank Connect 24

            05.113 - Sản phẩm bảo hiểm Bộ 3 bảo vệ trên VCB là sản phẩm hợp tác giữa Vietcombank và đơn vị nào?

                      A.  FWD

      35              B.  PJICO

                      C.  DAICHI

                      D.  Không có đáp án nào đúng

            05.067 - Với mục tiêu (i) số hóa hành trình, gia tăng trải nghiệm cho Đơn vị chấp nhận thanh toán (ĐVCNTT)
            và (ii) bán chéo gia tăng hiệu quả tổng thể của ĐVCNTT, CN khi phát triển ĐVCNTT cần thực hiện yêu cầu gì?

                      A.  Bắt buộc mở VCB Digibiz cho ĐVCNTT thuộc phân khúc SMEs.

      36              B.  Bắt buộc mở Merchant Portal phiên bản mới cho ĐVCNTT thuộc phân khúc Bán buôn.

                      C.  Bắt buộc mở Merchant Portal phiên bản mới cho ĐVCNTT thuộc phân khúc Bán buôn và Bán lẻ.

                      D.  Bắt buộc mở VCB Digibiz cho ĐVCNTT thuộc phân khúc SMEs và mở Merchant Portal phiên bản mới
                          cho ĐVCNTT thuộc phân khúc Bán buôn.

            05.114 - Hiện tại có bao nhiêu sản phẩm bảo hiểm trực tuyến FWD mà khách hàng có thể thực hiện mua trên
            VCB Digibank

                      A.  2
      37
                      B.  3

                      C.  4

                      D.  5

            05.066 - Lợi ích của việc tích hợp chức năng Merchant Portal dành cho Đơn vị chấp nhận thanh toán
            (ĐVCNTT) ngay trên VCB Digibiz là gì?

                      A.  Gia tăng trải nghiệm cho ĐVCNTT: cho phép ĐVCNTT sử dụng chức năng Merchant Portal ngay trên
                          VCB Digibiz mà không cần truy cập vào Merchant Portal độc lập.

      38              B.  Đơn giản hóa tác nghiệp cho CN không phải tạo tài khoản Merchant Portal phiên bản mới cho ĐVCNTT
                          (ĐVCNTT truy cập VCB Digibiz có thể sử dụng ngay chức năng Merchant Portal).

                      C.  Hỗ trợ CN trong việc bán chéo các dịch vụ tài chính, mở rộng hợp tác với ĐVCNTT để gia tăng hiệu quả
                          tổng thể cho VCB.

                      D.  Tất cả đáp án trên đều đúng

            05.115 - KHCN thực hiện kích hoạt thẻ tại ứng dụng VCB Digibank bằng cách nào?

                      A.  Khách hàng nhập số thẻ theo định dạng 6 số đầu và 3 số cuối in trên thẻ

      39              B.  Khách hàng quét mã QR in trên PIN mailer

                      C.  Khách hàng nhập số thẻ theo định dạng 6 số đầu và 4 số cuối in trên thẻ

                      D.  A&C

      40    05.064 - Đối với Đơn vị chấp nhận thanh toán (ĐVCNTT) do Trung gian thanh toán (TGTT) phát triển (theo mô

             hình 02 Bên), CN cần thực hiện công việc gì?

                      A.  (i)Tiếp nhận ĐVCNTT do TGTT phát triển và TSC phân bổ (theo nguyên tắc phân bổ đều cho các CN
                          trên cùng địa bàn) để thẩm định, quản trị rủi ro theo quy định; (ii) Khai thác bán chéo các dịch vụ tài
                          chính khác của VCB cho ĐVCNTT.

                      B.  (i)Tiếp nhận ĐVCNTT do TGTT phát triển và TSC phân bổ (theo nguyên tắc phân bổ đều cho các CN
                          trên cùng địa bàn) để thẩm định, quản trị rủi ro theo quy định; (ii) Lắp đặt thiết bị/triển khai kỹ thuật cho
                          ĐVCNTT; (iii) Khai thác bán chéo các dịch vụ tài chính khác của VCB cho ĐVCNTT.

                      C.  (i)Tiếp nhận ĐVCNTT do TGTT phát triển và TSC phân bổ (theo nguyên tắc phân bổ đều cho các CN
                          trên cùng địa bàn) để thẩm định, quản trị rủi ro theo quy định; (ii) Lắp đặt thiết bị/triển khai kỹ thuật cho
                          ĐVCNTT; (iii) Vận hành, đối soát, tra soát cho ĐVCNTT; (iv) Khai thác bán chéo các dịch vụ tài chính
                          khác của VCB cho ĐVCNTT;

                      D.  (i) Lắp đặt thiết bị/ triển khai kỹ thuật cho ĐVCNTT; (ii) Vận hành, đối soát, tra soát cho ĐVCNTT; (iii)
                          Khai thác bán chéo các dịch vụ tài chính khác của VCB cho ĐVCNTT.

            05.011 - Tên truy cập đối với dịch vụ VCB Digibank là

                      A.  Số điện thoại khách hàng đăng ký dịch vụ

      41              B.  Số CIF của khách hàng tại VCB

                      C.  Số tài khoản thanh toán của Khách hàng

                      D.  Chuỗi ký tự do Khách hàng đặt bao gồm cả chữ và số và ký tự đặc biệt

            05.039 - Hạn mức rút tiền mặt tối đa/ 1 lần rút tiền của thẻ ghi nợ nội địa phi vật lý trên Digibank là bao
             nhiêu?

                      A.  5 triệu VNĐ
      42
                      B.  10 triệu VNĐ

                      C.  15 triệu VNĐ

                      D.  20tr VNĐ

            05.117 - Nickname tài khoản thứ 2 của KH có thể liên kết với:

                      A.  Tài khoản VNĐ đã liên kết với nickname tài khoản đầu tiên hoặc bất kỳ tài khoản thanh toán VNĐ khác
                          của KH

                      B.  Tài khoản VNĐ đã liên kết với nickname tài khoản đầu tiên hoặc tài khoản thanh toán ngoại tệ khác của
      43                  KH

                      C.  Tài khoản VNĐ đã liên kết với nickname tài khoản đầu tiên hoặc tài khoản bất kỳ khác của KH

                      D.  Tài khoản VNĐ đã liên kết với nickname tài khoản đầu tiên hoặc tài khoản thanh toán VNĐ khác của KH
                          (không bao gồm tài khoản thanh toán đồng chủ sở hữu, tài khoản được mở qua hình thức eKYC chưa
                          được xác thực tại quầy)

            05.060 - Dịch vụ Nộp tiền Giao dịch chứng khoán hiện đang được VCB triển khai qua các kênh thanh toán
             nào?

                      A.  Quầy giao dịch VCB
      44
                      B.  VCB Digibank

                      C.  Kênh Ngân hàng điện tử của các Ngân hàng khác

                      D.  Tất cả các đáp án đều đúng

            05.123 - KH có thể thực hiện mua bảo hiểm trực tuyến trên VCB Digibank qua những kênh nào?

                      A.  App

      45              B.  Web

                      C.  Cả App và Web

                      D.  Không có đáp án nào đúng

            05.058 - Dịch vụ Thanh toán tự động (VCB Auto Debit) hiện đang được VCB triển khai với các dịch vụ thuộc
             lĩnh vực nào?

                      A.  Hóa đơn tiền điện, nước
      46
                      B.  Phí bảo hiểm, Hóa đơn cước viễn thông VNPT

                      C.  Khoản vay tài chính, Phí dịch vụ vệ sinh môi trường

                      D.  Tất cả các đáp án đều đúng

      47    05.007 - Đối tượng khách hàng được phép đăng ký sử dụng VCB Digibank

                      A.  Tất cả KHCN của Vietcombank

                      B.  KHCN thuộc đối tượng được phép mở tài khoản tiền gửi theo quy định mở và sử dụng tài khoản tiền gửi
                          hiện hành của VCB và đáp ứng các điều kiện sử dụng dịch vụ

                      C.  KHCN thuộc đối tượng được phép mở tài khoản tiền gửi theo quy định mở và sử dụng tài khoản tiền gửi
                          hiện hành của VCB

                      D.  KHCN trên 18 tuổi và đáp ứng các điều kiện sử dụng dịch vụ

            05.042 - End of sale/ End of life là tiêu chí đánh giá thanh lý ATM nào sau đây?

                      A.  Tiêu chí 1: Thời gian sử dụng

      48              B.  Tiêu chí 2: Tiêu chuẩn kỹ thuật của hãng sản xuất

                      C.  Tiêu chí 3: Tiêu chuẩn kỹ thuật của thiết bị

                      D.  Không có đáp án nào đúng

            05.124 - KH A thực hiện thanh toán phí Bảo hiểm trên VCB FWD trên VCB Digibank. Các thông tin KH phải
             nhập bao gồm những thông tin nào

                      A.  Mã khách hàng
      49
                      B.  Mã khách hàng Tên Khách hàng

                      C.  Mã khách hàng Tên Khách hàng Số tiền

                      D.  Không có đáp án nào chính xác

            05.056 - Khách hàng có thể thực hiện đăng ký liên kết Tài khoản thanh toán của KH với Ví điện tử thông qua
            các kênh nào trong các kênh sau đây?

                      A.  VCB Digibank
      50
                      B.  Ứng dụng Ví điện tử

                      C.  Quầy giao dịch

                      D.  Tất cả các đáp án đều đúng

            05.126 - Từ ngày 01/07/2024, KH có thể sử dụng các phương thức xác thực nào để xác thực giao dịch
            chuyển tiền nước ngoài trên VCB Digibank?

                      A.  Vân tay/ FaceID SMS OTP Smart OTP
      51
                      B.  SMS OTP Smart OTP

                      C.  Smart OTP

                      D.  Tất cả các phương án trên đều sai

            05.053 - Mô hình Thu hộ học phí cho các Đơn vị giáo dục hợp tác qua Công ty phần mềm được VCB triển
             khai với các Công ty phần mềm nào?

                      A.  Misa
      52
                      B.  Misa, SSC

                      C.  Misa, Yoyo, SSC

                      D.  Misa, Yoyo

            05.005 - Phương thức xác thực giao dịch bằng MPIN được áp dụng đối với loại giao dịch chuyển tiền nào
            sau đây trên VCB Digibank

                      A.  Chuyển tiền cùng chủ tài khoản trong VCB
      53
                      B.  Chuyển tiền trong VCB

                      C.  Chuyển tiền ngoài VCB

                      D.  Cả chuyển tiền trong và ngoài VCB

      54    05.046 - Trường hợp KH thực hiện nộp tiền tại ATM với số tiền 10 triệu đồng, trong đó có 03 triệu là số tiền

            thiết bị R-ATM không nhận diện được và 07 triệu là số tiền thiết bị R-ATM nhận diện được, thiết bị R-ATM xử
             lý như thế nào?

                      A.  R-ATM sẽ trả lại toàn bộ số tiền 10 triệu đồng cho KH và thông báo số tiền KH nộp đang có 03 triệu
                          không hợp lệ, đề nghị KH kiểm tra lại

                      B.  R-ATM sẽ tiếp nhận toàn bộ số tiền 10 triệu đồng và thông báo với KH có 03 triệu không hợp lệ, đề nghị
                          KH liên hệ Chi nhánh (Quầy) để xử lý

                      C.  R-ATM sẽ trả lại 03 triệu không nhận diện được để KH nhận lại. Đồng thời, R-ATM ghi nhận 07 triệu KH
                          thực hiện nộp tiền mặt thành công

                      D.  R-ATM trả lại 03 triệu không hợp lệ và 07 triệu hợp lệ cho KH, yêu cầu KH thực hiện nộp lại đúng 07
                          triệu hợp lệ mà R-ATM nhận diện được

            05.130 - Khách hàng có thể nộp những loại thuế gì tại ứng dụng VCB DigiBiz?

                      A.  Nộp phí hạ tầng cảng biển Nộp thuế nội địa Nộp thuế trước bạ Nộp thuế xuất nhập khẩu Nộp Bảo hiểm
                          xã hôi

      55              B.  Nộp phí hạ tầng cảng biển Nộp thuế nội địa Nộp thuế trước bạ Nộp thuế xuất nhập khẩu

                      C.  Nộp thuế nội địa Nộp thuế trước bạ Nộp thuế xuất nhập khẩu

                      D.  Nộp phí hạ tầng cảng biển Nộp thuế nội địa Nộp thuế môn bài Nộp thuế trước bạ Nộp thuế xuất nhập
                          khẩu Nộp Bảo hiểm xã hôi

            05.052 - Dịch vụ thanh toán qua mã QR tại Đơn vị chấp nhận thanh toán do VCB phát triển được triển khai từ
             khi nào?

                      A.  Tháng 10/2018
      56
                      B.  Tháng 02/2019

                      C.  Tháng 05/2019

                      D.  Tháng 10/2019

            05.131 - KH SME hiện có thể nhận thông tin nhắc nợ khoản vay qua các hình thức nào?

                      A.  Qua tin nhắn SMS Qua email

      57              B.  Qua tin nhắn SMS Qua thông báo OTT Qua email

                      C.  Qua tin nhắn SMS Qua thông báo OTT Qua email Qua Popup tại ứng dụng VCB DigiBiz trước ngày đến
                          hạn 7 ngày

                      D.  Tất cả các đáp án đều sai

            05.049 - Giải pháp thanh toán chạm trên di động - VCB Tap to Phone được VCB triển khai từ khi nào?

                      A.  02/2023

      58              B.  03/2023

                      C.  04/2023

                      D.  05/2023

            05.132 - Ứng dụng VCB DigiBiz cung ứng những tiện ích thẻ gì cho KH SME?

                      A.  Kích hoạt thẻ Cấp PIN thẻ Khóa/Mở khóa thẻ Đăng ký/Hủy đăng ký sử dụng thẻ trên Internet Đăng
                          ký/Hủy đăng ký sử dụng thẻ tại nước ngoài Thanh toán sao kê thẻ tín dụng Đăng ký phát hành thẻ ghi
                          nợ

      59              B.  Kích hoạt thẻ Khóa/Mở khóa thẻ Đăng ký/Hủy đăng ký sử dụng thẻ trên Internet Đăng ký/Hủy đăng ký
                          sử dụng thẻ tại nước ngoài Thanh toán sao kê thẻ tín dụng Đăng ký phát hành thẻ ghi nợ

                      C.  Kích hoạt thẻ Khóa/Mở khóa thẻ Thanh toán sao kê thẻ tín dụng

                      D.  Kích hoạt thẻ Khóa/Mở khóa thẻ Đăng ký/Hủy đăng ký sử dụng thẻ trên Internet Đăng ký/Hủy đăng ký
                          sử dụng thẻ tại nước ngoài

            05.047 - Trước khi đưa ATM vào hoạt động, CN cần thực hiện công việc nào sau đây

                      A.  Báo cáo NHNN về địa điểm, thời gian hoạt động

      60              B.  Tìm kiếm và đánh giá vị trí điểm đặt thiết bị ATM tiềm năng, hiệu quả

                      C.  Xây dựng booth đáp ứng và phù hợp các tiêu chuẩn lắp đặt ATM

                      D.  Cả 3 đáp án trên

            05.002 - KH có thiết bị di động có hệ điều hành Android phiên bản 6.0 thì có thể đăng ký sử dụng dịch vụ
            VCB Digibank được không

                      A.  KH có hệ điều hành Android phiên bản từ 5.0 trở lên có thể đăng ký sử dụng VCB Digibank

      61              B.  KH có hệ điều hành hệ điều hành Android phiên bản từ 6.0 trở lên có thể đăng ký sử dụng VCB Digibank

                      C.  Thiết bị di động sử dụng hệ điều hành Android của KH không bật quyền trợ năng (Accessibility) cho các
                          ứng dụng thuộc danh sách nghi ngờ tiềm ẩn rủi ro

                      D.  A&C

            05.104 - Khách hàng tổ chức, mã Quản trị có thể kích hoạt OTT qua các kênh nào?

                      A.  Hệ thống tự động kích hoạt OTT cho mã Quản trị ngay KH kích hoạt lần đầu VCB DigiBiz trên kênh App

      62              B.  Hệ thống tự động kích hoạt OTT cho mã Quản trị ngay KH kích hoạt lần đầu VCB DigiBiz trên kênh Web

                      C.  Hotline VCB theo số 1900545413

                      D.  A và B đều đúng

            05.133 - Trong mô hình 1 cấp (mô hình A), mã quản trị có quyền thực hiện các loại giao dịch nào sau đây

                      A.  Không được phép lập lệnh chuyển tiền cho 1 người thân có tài khoản tại VCB

      63              B.  Lập lệnh chuyển tiền cho 1 người thân có tài khoản tại VCB

                      C.  Chỉ được duyệt lệnh chuyển tiền cho 1 người thân có tài khoản tại VCB

                      D.  Cả B và C

            05.105 - Phạm vi gửi tin nhắn OTT Alert cho khách hàng gồm?

                      A.  Biến động số dư tài khoản thanh toán

      64              B.  Giao dịch chi tiêu thẻ tín dụng

                      C.  Giao dịch thu phí quản lý tài khoản, giao dịch trả lãi tiết kiệm vào tài khoản thanh toán

                      D.  Tất cả các đáp án trên đều đúng

            05.136 - KH A thực hiện đăng ký phát hành thẻ Ghi Nợ Visa Business trên Digibiz. KH có thể ủy quyền cho tối
            đa là bao nhiêu cá nhân sử dụng thẻ trên một giao dịch?

                      A.  3
      65
                      B.  4

                      C.  5

                      D.  6

            05.107 - Trường hợp khách hàng không muốn hiển thị thông báo OTT biến động số dư trước khi đăng nhập
            VCB Digibank, khách hàng cần thực hiện chế độ cài đặt nào ở chức năng quản lý thông báo?

                      A.  Cài đặt tắt Nhận thông báo từ ngân hàng
      66
                      B.  Cài đặt bật Xem thông báo nhanh

                      C.  Cài đặt tắt Xem thông báo nhanh

                      D.  Cài đặt bật thông báo Quản lý nhóm

            05.001 - Khách hàng được phép thực hiện các giao dịch gì đối với tài khoản thanh toán chung trên kênh
             Ngân hàng điện tử?

                      A.  Truy vấn thông tin
      67
                      B.  Chuyển tiền trong hệ thống

                      C.  Thanh toán hóa đơn

                      D.  Nạp tiền điện thoại cho chính mình

      68    05.110 - KH sử dụng ứng dụng VCB DigiBank có thể thực hiện thanh toán dư nợ thẻ tín dụng online cho
             những đối tượng nào sau đây?

                      A.  Chỉ thanh toán được cho chủ thẻ VCB

                      B.  Thanh toán được cho chủ thẻ tín dụng tại VCB và tại ngân hàng khác

                      C.  Chỉ thanh toán được cho thẻ của mình

                      D.  Tất cả các đáp án trên đều sai

            05.138 - Trong mô hình 2 cấp (mô hình B), Để thực hiện giao dịch mở tài khoản số chọn trên VCB DigiBiz, KH
            cần thực hiện các bước nào sau đây:

                      A.  Mã lập lệnh lập yêu cầu Mã duyệt lệnh/ Mã quản trị thực hiện duyệt lệnh
      69
                      B.  Chỉ cần mã lập lệnh thực hiện lập yêu cầu (không cần duyệt)

                      C.  Chỉ cần mã quản trị thực hiện

                      D.  Tất cả các đáp án đều sai

            02.001 - Nội dung: "Các mức phí quy định tại mục I có tính chất định hướng, tham khảo. Căn cứ tính chất,
            đặc điểm của khoản vay và mức độ cạnh tranh, chi nhánh chủ động đàm phán, áp dụng loại phí và mức phí
             phù hợp" tại Quy định 1668/QyĐ-VCB-PTSPBL ngày 18/08/2023 về Quy định phí trả nợ trước hạn áp dụng với
             Khách hàng tổ chức bán lẻ (QyĐ 1668) có nghĩa là?

                      A.  Chi nhánh được phép chủ động đàm phán và áp dụng mức phí cao hơn so với mức phí quy định tại mục
                          I của QyĐ 1668
      70
                      B.  Chi nhánh chỉ được phép đàm phán mức phí thấp hơn mức quy định tại mục I QyĐ 1668; việc áp dụng
                          mức phí sau đàm phạn nêu trên phải do cấp thẩm quyền cao hơn Giám đốc chi nhánh phê duyệt

                      C.  Chi nhánh được phép đàm phán và áp dụng mức phí thấp hơn so với mức phí quy định tại mục I QyĐ
                          1668

                      D.  A & C

            05.139 - Để in UNC và Phiếu hạch toán của các giao dịch chuyển tiền ngày giá trị hiện tại đã thực hiện thành
            công trên VCB DigiBiz, KH cần truy cập chức năng nào?

                      A.  Quản lý trạng thái lệnh giao dịch
      71
                      B.  Giao dịch chờ duyệt

                      C.  Báo cáo phí giao dịch

                      D.  Tất cả các phương án trên

            02.002 - Đâu là điểm mới cơ bản nhất về đối tượng Khách hàng của sản phẩm tài trợ vốn lưu động đối với
             Khách hàng tổ chức bán lẻ kinh doanh lớn (theo QĐ số 2193/QĐ-VCB-PTSPBL ngày 31/12/2023)?

                      A.  Đối tượng áp dụng dành cho Khách hàng tổ chức bán lẻ không phải SME nhỏ/siêu nhỏ tín dụng
      72
                      B.  Đối tượng áp dụng dành cho tất cả Khách hàng tổ chức bán lẻ

                      C.  Đối tượng áp dụng dành cho KH SME nhỏ/siêu nhỏ tín dụng

                      D.  Đối tượng án dụng dành cho KH SME nhỏ

             11.006 - Trong bảo lãnh ngân hàng theo quy định hiện hành của NHNN, bên bảo lãnh có thể là đối tượng nào
            sau đây?

                      A.  Tổ chức tín dụng trong nước
      73
                      B.  Tổ chức tín dụng nước ngoài

                      C.  Chi nhánh ngân hàng nước ngoài

                      D.  Phương án A, B, C đều đúng.

      74    02.004 - Khách hàng là Công ty X đang có quan hệ tín dụng với VCB chi nhánh Y với mức lãi suất cho vay

             hiện tại (sau thời gian áp dụng lãi suất ưu đãi cố định) là 9,3%, phí trả nợ trước hạn 0,5%. Khách hàng đang
            được MBBank mời chào cho vay để trả nợ trước hạn cho khoản vay này với mức lãi suất cho vay đề nghị là
            6,9% cố định 02 năm, phí trả nợ trước hạn là 4% trong 04 năm. Nếu bạn là cán bộ thẩm định quản lý khách
             hàng của VCB chi nhánh Y, bạn sẽ làm gì?

                      A.  Không làm gì cả, nếu khách hàng muốn sẽ cho khách hàng thực hiện vay vốn tại MBBank để trả nợ
                          khoản vay trước đó để giúp khách hàng có lãi suất tốt hơn.

                      B.  Thực hiện đàm phán với khách hàng về mức lãi suất và mức phí trả nợ trước hạn phù hợp bảo đảm
                          giữa giữ chân được khách hàng và lợi nhuận đem lại cho chi nhánh. Khẩn trương trình cấp thẩm quyền
                          phê duyệt nhằm điều chỉnh mức lãi suất và phí trả nợ phù hợp như đã đàm phán để áp dụng cho khách

                          hàng. Tiếp tục khai thác và bám sát các hoạt động kinh doanh của khách hàng nhằm tư vấn và khơi gợi
                          Khách hàng gia tăng sử dụng các dịch vụ của VCB

                      C.  Mượn user của cán bộ quản lý nợ để điều chỉnh lãi suất cho khách hàng tương đương với lãi suất cho
                          vay MBBank đang mời chào khách hàng

                      D.  Tự động nhờ vợ/chồng là cán bộ Quản lý nợ điều chỉnh lãi suất cho khách hàng tương ứng với lãi suất
                          MBBank đang mời chào khách hàng

             11.007 - Theo quy định hiện hành của NHNN hướng dẫn về dịch vụ thanh toán không dùng tiền mặt, nhận
            định nào sau đây là SAI?

                      A.  Dịch vụ chuyển tiền là việc tổ chức cung ứng dịch vụ thanh toán thực hiện theo yêu cầu của bên trả tiền
                          nhằm chuyển một số tiền nhất định cho bên thụ hưởng.

                      B.  Trong dịch vụ chuyển tiền, bên thụ hưởng có thể đồng thời là bên trả tiền.
      75
                      C.  Sau khi nhận được lệnh chuyển tiền do ngân hàng phục vụ bên trả tiền chuyển đến, ngân hàng phục vụ
                          bên thụ hưởng tiến hành kiểm soát chứng từ và chậm nhất trong 01 ngày làm việc kể từ thời điểm nhận
                          được lệnh chuyển tiền, ngân hàng phục vụ bên thụ hưởng phải hạch toán vào tài khoản thanh toán của
                          bên thụ hưởng và báo Có cho bên thụ hưởng nếu lệnh chuyển tiền hợp pháp, hợp lệ

                      D.  Quy trình thực hiện dịch vụ chuyển tiền không qua tài khoản thanh toán của khách hàng được thực hiện
                          như quy trình dịch vụ thanh toán ủy nhiệm chi.

            02.058 - Theo CV 11938 ngày 31/8/2024 về Sản phẩm cho vay KHCN để trả nợ trước hạn khoản vay tại TCTD:
            Tài sản bảo đảm (TSBĐ) đang bảo đảm cho khoản vay của KH tại TCTD phải đáp ứng điều kiện gì để được
             nhận làm TSBĐ cho khoản vay tại VCB?

                      A.  Thỏa mãn đồng thời 02 điều kiện: - Là TSBĐ được nhận theo quy định tại các Sản phẩm cho vay tương
                          ứng quy định tại CV 11938 - TSBĐ thuộc sở hữu của chính KH vay

                      B.  Thỏa mãn đồng thời 02 điều kiện: - Là TSBĐ có mức ưu tiên 1 và 2 theo quy định tại hướng dẫn thực
      76                  hiện Chính sách bảo đảm tín dụng của VCB từng thời kỳ - TSBĐ thuộc sở hữu của chính KH vay

                      C.  Thỏa mãn 1 trong 2 điều kiện: - Là TSBĐ được nhận theo quy định tại các Sản phẩm cho vay tương ứng
                          quy định tại CV 11938 - TSBĐ thuộc sở hữu của chính KH vay hoặc Bên thứ ba là bố mẹ đẻ/con đẻ của
                          KH

                      D.  Thỏa mãn đồng thời 02 điều kiện: - Là TSBĐ được nhận theo quy định tại các Sản phẩm cho vay tương
                          ứng quy định tại CV 11938 - TSBĐ thuộc sở hữu của chính KH vay hoặc Bên thứ ba là bố mẹ đẻ/con đẻ
                          của KH

             11.005 - Căn cứ quy định hiện hành của pháp luật về Nhà ở, nhận định nào sau đây là ĐÚNG?

                      A.  Trong mọi trường hợp, Bên mua nhà ở xã hội không được bán lại nhà ở trong thời hạn tối thiểu là 03
                          năm, kể từ thời điểm thanh toán hết tiền mua nhà ở.

                      B.  Trong mọi trường hợp, Bên mua nhà ở xã hội không được bán lại nhà ở trong thời hạn tối thiểu là 05
                          năm, kể từ thời điểm thanh toán hết tiền mua nhà ở.

                      C.  Bên mua nhà ở xã hội không được bán lại nhà ở trong thời hạn tối thiểu là 03 năm kể từ thời điểm thanh
                          toán hết tiền mua nhà ở, trừ trường hợp trong thời hạn 03 năm kể từ ngày bên mua nhà ở xã hội đã
      77                  thanh toán đủ tiền mua nhà ở mà có nhu cầu bán nhà ở này thì chỉ được bán lại cho chủ đầu tư dự án
                          đầu tư xây dựng nhà ở xã hội hoặc bán lại cho đối tượng thuộc trường hợp được mua nhà ở xã hội với
                          giá bán tối đa bằng giá bán nhà ở xã hội này trong hợp đồng mua bán với chủ đầu tư dự án đầu tư xây
                          dựng nhà ở xã hội.

                      D.  Bên mua nhà ở xã hội không được bán lại nhà ở trong thời hạn tối thiểu là 05 năm kể từ ngày thanh
                          toán đủ tiền mua nhà ở, trừ trường hợp trong thời hạn 05 năm, kể từ ngày bên mua nhà ở xã hội đã
                          thanh toán đủ tiền mua nhà ở mà có nhu cầu bán nhà ở này thì chỉ được bán lại cho chủ đầu tư dự án
                          đầu tư xây dựng nhà ở xã hội hoặc bán lại cho đối tượng thuộc trường hợp được mua nhà ở xã hội với
                          giá bán tối đa bằng giá bán nhà ở xã hội này trong hợp đồng mua bán với chủ đầu tư dự án đầu tư xây
                          dựng nhà ở xã hội.

      78    02.005 - Tại sao cần phát triển cho vay Khách hàng SME trong giai đoạn hiện nay?

                      A.  - Giảm sự phụ thuộc vào loại hình vay mua bất động sản hiện nay - Không phải thực hiện chi trả hoa
                          hồng môi giới như cho vay nhà dự án, cho vay mua ô tô

                      B.  - Thu được dòng tiền huy động vốn không kỳ hạn ổn định, và gia tăng bán chéo các sản phẩm dịch vụ
                          khác - Có chính sách về tỷ lệ tài sản bảo đảm tối thiểu thường thấp hơn KHCN, dễ đàm phán hơn khi
                          cho vay KHCN

                      C.  - Theo định hướng tập trung phát triển cho vay ngắn hạn sản xuất kinh doanh nhằm thực hiện giải pháp
                          phục hồi và thúc đẩy tăng trưởng kinh tế của Chính Phủ và Ban điều hành; - Giảm sự phụ thuộc vào loại

                          hình vay mua bất động sản - Không phải thực hiện chi trả hoa hồng môi giới như cho vay các loại hình
                          khác (cho vay mua ô tô, cho vay mua nhà dự án...)

                      D.  - Giảm sự phụ thuộc vào loại hình cho vay mua bất động sản; - Thu được dòng tiền huy động vốn không
                          kỳ hạn ổn định và gia tăng bán chéo các sản phẩm dịch vụ khác; - Theo định hướng tập trung phát triển
                          cho vay ngắn hạn sản xuất kinh doanh nhằm thực hiện các giải pháp phục hồi và thúc đẩy tăng trưởng
                          kinh tế của Chính Phủ và Ban Điều hành VCB.

            02.006 - Định hướng phát triển tín dụng bán lẻ của VCB theo chỉ đạo triển khai nhiệm vụ kinh doanh 2024 và
             những năm sắp tới là gì?

                      A.  Tiếp tục duy trì thế mạnh tín dụng bất động sản tiêu dùng
      79
                      B.  Tập trung tăng trưởng tín dụng SXKD KHCN và KH SME

                      C.  Tập trung tăng trưởng tín dụng bất động sản, SXKD KHCN và KH SME

                      D.  A & B

             11.008 - Theo quy định hiện hành của NHNN, việc mở tài khoản thanh toán bằng phương thức điện tử
             KHÔNG áp dụng với trường hợp nào sau đây?

                      A.  Tài khoản thanh toán chung
      80
                      B.  Tài khoản thanh toán bằng ngoại tệ

                      C.  Khách hàng cá nhân là người từ đủ 15 tuổi đến chưa đủ 18 tuổi

                      D.  Tất cả phương án A, B, C đều đúng.

            02.008 - Theo sản phẩm Tài trợ vốn lưu động đối với Khách hàng tổ chức bán lẻ kinh doanh nhỏ ngành
            thương mại dược ban hành theo Quyết định số 2917/QĐ-VCB-PTSPBL ngày 31/12/2023, giá trị Hạn mức bảo
             lãnh và/hoặc Số tiền bảo lãnh nào sau đây là đúng?

                      A.  Theo quy định tại Hồ sơ mời thầu nhưng không quá 3% giá gói thầu và không quá 3 tỷ VNĐ
      81
                      B.  Theo quy định tại Hồ sơ mời thầu nhưng không quá 5% giá gói thầu và không quá 5 tỷ VNĐ

                      C.  Theo quy định tại Hồ sơ mời thầu nhưng không quá 7% giá gói thầu và không quá 7 tỷ VNĐ

                      D.  Theo quy định tại Hồ sơ mời thầu nhưng không quá 10% giá gói thầu và không quá 10 tỷ VNĐ

             11.009 - Căn cứ quy định hiện hành của pháp luật về Nhà ở, các giao dịch nào về nhà ở sau đây KHÔNG BẮT
             BUỘC phải có Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất?

                      A.  Mua bán, thuê mua, thế chấp nhà ở hình thành trong tương lai; bán nhà ở trong trường hợp giải thể, phá
                          sản.
      82
                      B.  Chuyển nhượng hợp đồng mua bán, thuê mua nhà ở, công trình xây dựng.

                      C.  Đáp án A và B đều đúng

                      D.  Không có đáp án nào đúng

            02.262 - Phí xử lý giao dịch nội tệ tại nước ngoài được áp dụng với giao dịch nào sau đây?

                      A.  Giao dịch bằng VND tại ĐVCNT nước ngoài

      83              B.  Giao dịch bằng ngoại tệ tại ĐVCNT nước ngoài

                      C.  Giao dịch bằng VND tại bất kỳ ĐVCNT nào

                      D.  Giao dịch bằng VND tại ĐVCNT nước ngoài và Giao dịch bằng ngoại tệ tại ĐVCNT nước ngoài

             11.014 - Căn cứ quy định hiện hành của NHNN, nhận định nào sau đây mô tả ĐÚNG về dịch vụ Ví điện tử?

                      A.  Tổng hạn mức giao dịch qua các Ví điện tử cá nhân của 01 khách hàng tại 01 tổ chức cung ứng dịch vụ
                          Ví điện tử tối đa là 150 triệu đồng Việt Nam trong một tháng.

                      B.  Tổ chức cung ứng dịch vụ Ví điện tử có thể thực hiện hoạt động khuyến mại bằng cách tặng tiền vào Ví
      84                  điện tử cho khách hàng.

                      C.  Tài khoản đồng Việt Nam hoặc thẻ ghi nợ được khách hàng sử dụng để liên kết với ví điện tử phải có
                          đăng ký sử dụng dịch vụ thanh toán bằng phương tiện điện tử tại ngân hàng liên kết.

                      D.  Tại một thời điểm, khách hàng chỉ được liên kết Ví điện tử với một tài khoản thanh toán duy nhất mở tại
                          ngân hàng liên kết.

            02.009 - Theo quy định sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh nhỏ ngành thương mại thực
             phẩm, đồ uống bao gói sẵn ban hành theo Quyết định số 2911/QĐ-VCB-PTSPBL ngày 31/12/2023, Tại thời
            điểm nhận thế chấp, thời hạn sử dụng còn lại của hàng hóa lưu kho được nhận làm tài sản bảo đảm nào là
            đúng quy định?

      85              A.  Không ngắn hơn 2/3 tổng thời hạn sử dụng và không ngắn hơn 06 tháng

                      B.  Không ngắn hơn 1/2 tổng thời hạn sử dụng và không ngắn hơn 12 tháng

                      C.  Không ngắn hơn 2/3 tổng thời hạn sử dụng và không ngắn hơn 12 tháng

                      D.  Không ngắn hơn 1/3 tổng thời hạn sử dụng và không ngắn hơn 06 tháng

             11.003 - Điều kiện nào để tổ chức tín dụng cho khách hàng vay trả nợ trước hạn khoản vay tại tổ chức tín
            dụng khác ?

                      A.  Khoản vay tại tổ chức tín dụng khác (Khoản vay cũ) là khoản vay phục vụ hoạt động kinh doanh, chưa
                          thực hiện cơ cấu lại thời hạn trả nợ và thời hạn cho vay để trả nợ trước hạn khoản vay cũ không vượt
                          quá thời hạn cho vay còn lại của khoản vay cũ

                      B.  Khoản vay tại tổ chức tín dụng khác (Khoản vay cũ) chưa thực hiện cơ cấu lại thời hạn trả nợ và thời
      86                  hạn cho vay để trả nợ trước hạn khoản vay cũ không vượt quá thời hạn cho vay còn lại của khoản vay
                          cũ

                      C.  Khoản vay tại tổ chức tín dụng khác (Khoản vay cũ) là khoản vay phục vụ hoạt động kinh doanh và chưa
                          thực hiện cơ cấu lại thời hạn trả nợ

                      D.  Khoản vay tại tổ chức tín dụng khác (Khoản vay cũ) là khoản vay phục vụ hoạt động kinh doanh và thời
                          hạn cho vay để trả nợ trước hạn khoản vay cũ không vượt quá thời hạn cho vay còn lại của khoản vay
                          cũ

            02.010 - Theo sản phẩm Tài trợ vốn lưu động đối với Khách hàng tổ chức bán lẻ kinh doanh lớn ngành
            thương mại dược (ban hành theo Quyết định số 2918/QĐ-VCB-PTSPBL ngày 31/12/2023), điều kiện về tỷ lệ
            đòn bẩy (Nợ phải trả/Vốn chủ sở hữu hoặc tỷ lệ đó sau khi điều chỉnh các khoản mục kế toán chi tiết để tính
            toán hệ số này theo đánh giá của cấp thẩm quyền) là:

      87              A.  ≤ 3 lần

                      B.  ≤ 4 lần

                      C.  ≤ 5 lần

                      D.  ≤ 6 lần

             11.015 - Anh A (32 tuổi, quốc tịch Pháp, sang Việt Nam công tác với thời hạn visa 3 tháng) có nhu cầu sử
            dụng thẻ ngân hàng để chi tiêu trong thời gian công tác tại Việt Nam. Vậy anh A có thể được phát hành loại
            thẻ nào của VCB sau đây?

                      A.  Thẻ ghi nợ
      88
                      B.  Thẻ tín dụng

                      C.  Không được phát hành bất kỳ loại thẻ nào

                      D.  Đáp án A và B đều đúng

            02.011 - Theo sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh nhỏ ngành thương mại trang thiết bị y
            tế ban hành theo Quyết định số 2916/QĐ-VCB-PTSPBL ngày 31/12/2023, thời hạn vay vốn tối đa của mỗi
             khoản giải ngân là:

                      A.  3 tháng
      89
                      B.  6 tháng

                      C.  9 tháng

                      D.  12 tháng

      90     11.016 - Chị C vừa phát hành thành công thẻ tín dụng của VCB. Hạn mức rút tiền mặt tối đa mà chị C có thể
            thực hiện là bao nhiêu?

                      A.  Tương đương 30 triệu đồng/thẻ/ngày đối với hạn mức rút ngoại tệ tiền mặt tại nước ngoài.

                      B.  100 triệu đồng/tháng đối với tổng hạn mức rút tiền mặt tính thẻ BIN thẻ tín dụng.

                      C.  Tương đương 30 triệu đồng/thẻ/ngày đối với hạn mức rút ngoại tệ tiền mặt tại nước ngoài và không giới
                          hạn hạn mức rút tiền mặt theo tháng.

                      D.  Phương án A và B đều đúng.

            02.014 - Theo Công văn số 4067/VCB-PTSPBL ngày 26/03/2024 v/v Chương trình cho vay VND lãi suất cạnh
            tranh năm 2024 đối với Khách hàng tổ chức bán lẻ, trường hợp khách hàng bị phân loại nợ từ nhóm 2 đến
             nhóm 5 trong thời gian hưởng ưu đãi lãi suất, Chi nhánh sẽ thực hiện?

                      A.  Chi nhánh áp dụng mức lãi suất cho vay thông thường đối với khách hàng kể từ thời điểm phát sinh nợ
                          bị phân loại nợ từ nhóm 2 đến nhóm 5

      91              B.  Chi nhánh áp dụng mức lãi suất cho vay thông thường đối với khoản vay của khách hàng kể từ thời
                          điểm phát sinh nợ bị phân loại nợ từ nhóm 2 đến nhóm 5, các tài khoản vay được phân loại nợ nhóm 1
                          vẫn giữ nguyên mức lãi suất ưu đãi

                      C.  Chi nhánh vẫn tiếp tục áp dụng lãi suất cho vay ưu đãi cho các khoản vay đã giải ngân trước thời điểm
                          phát sinh nợ bị phân loại nợ từ nhóm 2 đến nhóm 5. Áp dụng mức lãi suất cho vay thông thường đối với
                          các khoản vay giải ngân mới

                      D.  Không đáp án nào đúng

             11.001 - Ngân hàng, chi nhánh ngân hàng nước ngoài phải thông báo cho khách hàng tối thiểu bao nhiêu
             ngày trước ngày hết hiệu lực của giấy tờ tùy thân để kịp thời yêu cầu khách hàng cập nhật, bổ sung thông
            tin?

                      A.  20
      92
                      B.  30

                      C.  40

                      D.  50

            02.259 - Lãi phát sinh đối với giao dịch rút tiền mặt thẻ tín dụng Vietcombank được tính từ thời điểm nào?

                      A.  Ngày sao kê

      93              B.  Ngày đề nghị thanh toán

                      C.  Ngày cuối tháng

                      D.  Ngày giao dịch rút tiền mặt được cập nhật vào hệ thống Vietcombank

             11.019 - VCB được phép chủ động phong tỏa tài khoản thanh toán của khách hàng trong trường hợp nào
            sau đây?

                      A.  Người chuyển tiền nhầm vào tài khoản của khách hàng yêu cầu phong tỏa.

      94              B.  VCB phát hiện có sai lệch hoặc có dấu hiệu bất thường trong quá trình mở và sử dụng tài khoản thanh
                          toán của khách hàng.

                      C.  VCB có cơ sở nghi ngờ tài khoản thanh toán của khách hàng có gian lận, vi phạm pháp luật và đã có
                          thỏa thuận trước với khách hàng.

                      D.  Không có đáp án nào đúng.

            02.015 - Trường hợp KH A ký kết hợp đồng cho vay từ tháng 10/2023, đủ điều kiện tham gia vào chương trình
            An tâm lãi suất 2023, giá trị hợp đồng cho vay trung dài hạn 20 tỷ đồng, đã giải ngân 11 tỷ đồng vào thời
            điểm 11/2023. Hiện tại, KH A muốn giải ngân phần tiền còn lại để tài trợ dự án, chi nhánh có thể lựa chọn
             mức lãi suất cho vay nào đối với phần tiền giải ngân còn lại của KH A?

                      A.  Áp dụng lãi suất cho vay (thông thường) theo Quyết định 459/QĐ-VCB-PTSPBL ngày 26/03/2024

      95              B.  Áp dụng lãi suất cho vay theo sàn lãi suất cho vay của chương trình An tâm lãi suất 2024 vì tại thời điểm
                          thẩm định ban đầu KH A đã đáp ứng các điều kiện chương trình An tâm lãi suất 2023

                      C.  Trình cấp thẩm quyền phê duyệt mức lãi suất cho vay đối với phần tiền còn lại của KH A tương tự mức
                          lãi suất của chương trình An tâm lãi suất 2024 theo cơ chế ủy quyền GĐCN giảm lãi suất cho vay (CV
                          5036/VCB-PTSPBL ngày 04/04/2024) nhằm bảo đảm quyền lợi khách hàng và đáp ứng đề xuất của
                          Khách hàng

                      D.  A & C

      96     11.020 - Công ty cổ phần (CTCP) X dự kiến vay vốn tại VCB với số tiền 350 tỷ đồng và được bảo đảm đầy đủ
             bằng 02 bất động sản trị giá 400 tỷ đồng thuộc quyền sở hữu của CTCP X. Vậy thẩm quyền chấp thuận việc
            vay vốn và bảo đảm thực hiện nghĩa vụ trả nợ vay của CTCP X đối với Ngân hàng thuộc cấp nào sau đây
            (biết rằng tổng giá trị tài sản của CTCP X được ghi trong báo cáo tài chính gần nhất là 1.000 tỷ đồng và Điều
             lệ công ty không có quy định khác so với quy định của pháp luật)?

                      A.  Đại hội đồng cổ đông.

                      B.  Hội đồng quản trị.

                      C.  Chủ tịch Hội đồng quản trị.

                      D.  Tổng Giám đốc.

            02.017 - Theo quy định về gói sản phẩm cho vay mua ô tô dành cho Khách hàng tổ chức bán lẻ (QĐ 433/QĐ-
            VCB-PTSPBL ngày 29/03/2023), phương tiện nào sau đây không phải là ô tô con/xe con?

                      A.  Xe ô tô bán tải (pickup), xe VAN có khối lượng hàng chuyên chở cho phép tham gia giao thông dưới
                          1000 kg.

      97              B.  Xe ô tô để chở người không quá 09 chỗ ngồi (kể cả chỗ người lái) được xác định theo Giấy chứng nhận
                          kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiên giao thông cơ giới đường bộ

                      C.  Xe ô tô bán tải (pickup), xe VAN có khối lượng hàng chuyên chở cho phép tham gia giao thông dưới 900
                          kg.

                      D.  Xe ô tô để chở người không quá 07 chỗ ngồi (kể cả chỗ người lái) được xác định theo Giấy chứng nhận
                          kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiên giao thông cơ giới đường bộ

             10.004 - Trường hợp nào sau đây VCB cần tiến hành nhận biết thông tin khách hàng?

                      A.  Khi khách hàng lần đầu mở tài khoản/thiết lập mối quan hệ với VCB nhằm sử dụng sản phẩm, dịch vụ
                          do VCB cung cấp

      98              B.  Khi khách hàng thực hiện giao dịch không thường xuyên có giá trị lớn

                      C.  Khi thực hiện chuyển tiền điện tử nhưng thiếu thông tin về tên, địa chỉ hoặc số tài khoản của người khởi
                          tạo

                      D.  Tất cả các trường hợp trên

            02.019 - Để hỗ trợ thúc đấy tăng trưởng tín dụng Sản xuất kinh doanh năm 2024, VCB đã ban hành chính
            sách nào để giúp các Chi nhánh có cơ chế thúc đẩy tăng trưởng tín dụng?

                      A.  Công văn số 6620/VCB-PTSPBL ngày 25/04/2024
      99
                      B.  Quyết định số 2913/QĐ-VCB-PTSPBL ngày 31/12/2023

                      C.  Quyế định số 2912/QĐ-VCB-PTSPBL ngày 31/12/2023

                      D.  Quyết định số 2914/QĐ-VCB-PTSPBL ngày 31/12/2023

             10.006 - Thông tin nhận biết khách hàng bao gồm những thông tin gì?

                      A.  Thông tin nhận dạng khách hàng

     100              B.  Thông tin về chủ sở hữu hưởng lợi

                      C.  Mục đích và bản chất của mối quan hệ kinh doanh của khách hàng với VCB

                      D.  Tất cả các thông tin trên

            02.258 - Vietcombank hiện đang áp dụng mức lãi suất như thế nào cho các hạng thẻ tín dụng?

                      A.  Mức lãi suất đồng nhất giữa các hạng thẻ

     101              B.  Mức lãi suất khác nhau giữa các hạng thẻ

                      C.  Theo quy định của Ngân hàng nhà nước VN

                      D.  Theo quy định của Tổ chức thẻ quốc tế

             10.003 - Danh sách đen là gì?

                      A.  Danh sách tổ chức, cá nhân do NHNN lập nhằm cảnh báo về tổ chức, cá nhân có rủi ro cao về rửa tiền

                      B.  Danh sách các chủ thể bị cảnh báo do bị điều tra, buộc tội, truy tố, kết án, bắt, phạt hành chính,… bởi
                          các cơ quan chính phủ, cảnh sát hoặc tòa án tại các nước trên thế giới
     102
                      C.  Danh sách tổ chức, cá nhân có liên quan đến khủng bố, tài trợ khủng bố do Bộ Công an chủ trì lập và
                          danh sách tổ chức, cá nhân bị chỉ định có liên quan đến phổ biến và tài trợ phổ biến vũ khí hủy diệt hàng
                          loạt do Bộ Quốc phòng chủ trì lập theo quy định của pháp luật

                      D.  Danh sách tổ chức, cá nhân có liên quan đến khủng bố, tài trợ khủng bố được liệt kê trong các nghị
                          quyết của Hội đồng Bảo an Liên Hợp Quốc


            02.020 - Cán bộ A đang tiếp cận Công ty B hoạt động trong khu chế xuất (mới - chưa có quan hệ với VCB).
            Công ty có nhu cầu vay tài trợ vốn lưu động với hạn mức cho vay 50 tỷ đồng và đề nghị lãi suất cho vay
            3,8%/năm đối với kỳ hạn vay từ 3 đến dưới 06 tháng, tài sản bảo đảm của khách hàng là 100% tiền gửi có kỳ
             hạn tại VCB. Hiện tại, BIDV cũng đang tiếp cận và mời chào khách hàng này với mức lãi suất cho vay cùng
             kỳ hạn là 3,8%/năm. Công ty B là công ty rất tiềm năng và có kết quả tình hình tài chính tốt, minh bạch nhưng
             mức lãi suất cho vay đang đề nghị thấp hơn so với quy định tại Chương trình Lãi suất cạnh tranh cho Khách
             hàng tổ chức bán lẻ 0,6%/năm. Cán bộ A nên làm gì?

                      A.  Thông báo với Khách hàng mức lãi suất thấp nhất có thể áp dụng là 4,8%/năm theo quy định và không
                          trình giảm lãi suất do ảnh hưởng tới lợi nhuận chi nhánh.
     103
                      B.  Thông báo với Khách hàng mức lãi suất thấp nhất có thể áp dụng là 4,3%/năm (sau khi sử dụng cơ chế
                          ủy quyền Giám đốc chi nhánh giảm lãi suất cho vay theo Công văn 5036/VCB-PTSPBL ngày
                          04/04/2024) vì ngại trình cấp cao hơn do phức tạp và tốn thời gian

                      C.  Đề xuất với lãnh đạo phòng trình cấp thẩm quyền tại TSC xem xét phê duyệt mức lãi suất tối thiểu bằng
                          3,8%/năm nhằm cạnh tranh với BIDV trên cơ sở phân tích các lợi ích của khách hàng đem lại mục tiêu
                          phát triển tín dụng sản xuất kinh doanh bền vững và chiến lược khai thác, bán chéo thêm các sản phẩm
                          dịch vụ cho khách hàng trong tương lai

                      D.  Tư vấn khách hàng sang sản phẩm cho KHCN vay vốn cầm cố Giấy tờ có giá để đơn giản thủ tục, lãi
                          suất thấp hơn và nhàn hơn

             10.008 - Rửa tiền là gì?

                      A.  Rửa tiền là hành vi của tổ chức, cá nhân nhằm hợp pháp hóa nguồn gốc của tài sản do phạm tội mà có

                      B.  Rửa tiền là hành vi của tổ chức tìm cách chuyển đổi tài sản hoặc lợi nhuận có được từ hành vi phạm tội
     104                  nhằm hợp pháp hóa nguồn gốc của tài sản do phạm tội mà có.

                      C.  Rửa tiền là hành vi của cá nhân tìm cách chuyển đổi tài sản hoặc lợi nhuận có được từ hành vi phạm tội
                          nhằm hợp pháp hóa nguồn gốc của tài sản do phạm tội mà có.

                      D.  Rửa tiền là hành vi của ngân hàng tìm cách chuyển đổi tài sản hoặc lợi nhuận có được từ hành vi phạm
                          tội nhằm hợp pháp hóa nguồn gốc của tài sản do phạm tội mà có.

            02.021 - Theo công văn số 6620/VCB-PTSPBL ngày 25/04/2024 về gói hỗ trợ thúc đẩy tăng trưởng tín dụng
            Sản xuất kinh doanh 2024, đối tượng khách hàng nào sau đây được áp dụng các cơ chế chính sách của
            Gói?

                      A.  Khách hàng tổ chức bán lẻ là đối tác cung cấp đầu vào, mua đầu ra của khách hàng hiện hữu VCB
     105
                      B.  Khách hàng cá nhân là đối tác cung cấp đầu vào, mua đầu ra của khách hàng hiện hữu VCB

                      C.  Khách hàng hiện hữu của VCB (bao gồm khách hàng bán buôn, khách hàng bán lẻ) đã giới thiệu cho
                          VCB các đối tác cung cấp đầu vào, mua đầu ra của mình

                      D.  Tất cả các đáp án trên

             10.009 - Giao dịch nào sau đây là giao dịch đáng ngờ?

                      A.  Khách hàng phát sinh giao dịch có giá trị lớn bất thường và rõ ràng không tương xứng với mức thu nhập
                          của khách hàng hoặc mức giá trị giao dịch thường xuyên của khách hàng với VCB

     106              B.  Có cơ sở hợp lý để nghi ngờ tài sản trong giao dịch của khách hàng có nguồn gốc từ hoạt động tội
                          phạm

                      C.  Giao dịch không phù hợp với quy mô, loại hình và lĩnh vực hoạt động của khách hàng

                      D.  Tất cả các phương án trên

            02.023 - Theo công văn số 2861/VCB-PTSPBL ngày 01/03/2024 về chương trình ưu đãi phí bảo lãnh đối với
             Khách hàng tổ chức bán lẻ năm 2024, mức giảm phí tối đa đối với bảo lãnh dự thầu trung dài hạn không theo
            sản phẩm và thuộc ngành thi công, xây lắp là bao nhiêu?

                      A.  30%
     107
                      B.  50%

                      C.  75%

                      D.  100%

     108     10.002 - Trường hợp nào sau đây VCB cần áp dụng việc cấm thiết lập hoặc chấm dứt quan hệ khách hàng?

                      A.  Cá nhân thuộc Danh sách đen

                      B.  Cá nhân thuộc Danh sách UN

                      C.  Cá nhân sử dụng giấy tờ định danh giả mạo

                      D.  Tất cả các trường hợp trên

            02.024 - Theo quy định về sản phẩm cho vay trung dài hạn hành cho Khách hàng tổ chức bán lẻ kinh doanh
             nhỏ (QĐ số 885/QĐ-VCB-PTSPBL ngày 27/05/2024), tỷ lệ bảo đảm tối thiểu là bao nhiêu?

                      A.  70%
     109
                      B.  80%

                      C.  90%

                      D.  100%

             10.016 - Khách hàng có quốc tịch Myanmar đến mở tài khoản VNĐ để nhận lương từ công ty trong nước. Chi
             nhánh thực hiện:

                      A.  Từ chối do Myanmar thuộc danh sách đen của FATF

     110              B.  Hỏi ý kiến Phòng PCRT để được hướng dẫn

                      C.  Thực hiện tra cứu khách hàng trên chương trình Siron KYC. Trường hợp khách hàng trùng khớp danh
                          sách PEP, tiếp tục tra cứu chủ thể có mối quan hệ liên quan để quyết định có cần hỏi ý kiến PCRT không

                      D.  Không có đáp án đúng

            02.257 - Tính năng Rút tiền mặt bằng mã QR trên ATM trên VCB Digibank cho phép khách hàng rút tiền mặt
            tại ATM của Vietcombank mà không cần sử dụng thẻ vật lý được áp dụng với các loại thẻ do Vietcombank
             nào?

                      A.  Thẻ ghi nợ nội địa
     111
                      B.  Thẻ ghi nợ quốc tế

                      C.  Thẻ tín dụng quốc tế

                      D.  Thẻ ghi nợ nội địa, thẻ ghi nợ quốc tế và thẻ tín dụng quốc tế

             10.017 - Khi tra cứu SironKYC, để xem thông tin chi tiết về Nội dung cảnh báo của chủ thể trong danh sách
            cảnh báo, giao dịch viên bấm vào mục:

                      A.  External sources
     112
                      B.  Relation

                      C.  Further information

                      D.  Các đáp án A, B, C đều sai

            02.026 - Theo quy định của sản phẩm tài trợ vốn lưu động đối với Khách hàng tổ chức bán lẻ kinh doanh nhỏ
            (QĐ số 2912/QĐ-VCB-PTSPBL ngày 31/12/2023), loại tài sản nào sau đây không được phép nhận làm tài sản
             bảo đảm?

                      A.  Quyền sử dụng đất nông nghiệp và tài sản gắn liền với đất (nếu có) đủ điều kiện nhận làm tài sản bảo
                          đảm theo quy định của VCB

     113              B.  Máy móc thiết bị, dây chuyền sản xuất có mức ưu tiên nhận bảo đảm là mức 3 (được nhận làm tài sản
                          bảo đảm lần đầu tại VCB) theo quy định của VCB trong từng thời kỳ

                      C.  Quyền sử dụng đất và/hoặc tài sản gắn liền với đất (nếu có) làm mặt bằng sản xuất kinh doanh được
                          thế chấp theo quy định của pháp luật, thời gian sử dụng đất còn lại không ngắn hơn thời gian vay vốn
                          (nếu không phải là đất thuê trả tiền hàng năm) hoặc theo quy định của VCB trong từng thời kỳ (nếu là
                          đất thuê trả tiền hàng năm)

                      D.  Ô tô có mức ưu tiên nhận bảo đảm là 1 và 2 theo quy định của VCB trong từng thời kỳ


            03.006 - Quản trị trải nghiệm của khách hàng là gì?

                      A.  Là quá trình tạo ra, quản lý và tối ưu hóa trải nghiệm của KH trong suốt quá trình tương tác với ngân
                          hàng
     114
                      B.  Là quá trình chào bán sản phẩm dịch vụ tới khách hàng

                      C.  Là quá trình chăm sóc sau khi bán sản phẩm dịch vụ cho khách hàng

                      D.  Đáp án A và B

            02.027 - Theo sản phẩm cho vay trung dài hạn dành cho Khách hàng tổ chức bán lẻ kinh doanh nhỏ theo
            quyết định số 885/QĐ-VCB-PTSPBL ngày 27/05/2024, thời hạn cho vay tối đa đối với khoản vay được bảo
            đảm toàn bộ bằng bất động sản và/hoặc tài sản có tính thanh khoản cao (có mức ưu tiên nhận bảo đảm là
             mức 1 và 2 theo quy định về bảo đảm tín dụng của VCB từng thời kỳ) là bao nhiêu?

     115              A.  120 tháng

                      B.  180 tháng

                      C.  240 tháng

                      D.  84 tháng

            03.008 - Nghị định 81/2018/NĐ-CP ngày 22/5/2018, trường hợp nào cần thực hiện thủ tục thông báo hoạt
            động khuyến mại tới các Sở Công thương trước khi triển khai chương trình khuyến mại?

                      A.  Chương trình khuyến mại có tổng giá trị giải thưởng, quà tặng dưới 100 triệu đồng
     116
                      B.  Bán hàng và khuyến mại thông qua sàn giao dịch thương mại điện tử, website khuyến mại trực tuyến

                      C.  A&B

                      D.  Không đáp án nào đúng

            02.053 - Theo CV 16917 ngày 01/12/2023 về hướng dẫn cho vay bù đắp cho KHCN, khoản vay không theo Sản
             phẩm tín dụng được xem xét cho vay bù đắp trong trường hợp nào?

                      A.  Mục đích vay vốn tương tự mục đích vay vốn tại các Sản phẩm tín dụng

     117              B.  Khoản vay thuộc thẩm quyền phê duyệt tín dụng cấp CN theo quy định của VCB từng thời kỳ song được
                          trình lên cấp thẩm quyền phê duyệt tín dụng là Lãnh đạo Phòng phê duyệt tín dụng

                      C.  Khoản vay thuộc thẩm quyền phê duyệt tín dụng từ cấp Lãnh đạo Phòng Phê duyệt tín dụng trở lên theo
                          quy định của VCB từng thời kỳ

                      D.  A và B

            03.004 - Chương trình tặng quà sinh nhật khách hàng Priority năm 2024 hiện hành do TSC triển khai đang áp
            dụng với các đối tượng khách hàng nào?

                      A.  KH Priority hạng Kim cương Elite
     118
                      B.  KH Priority hạng Kim cương

                      C.  KH Priority hạng Vàng

                      D.  Tất cả các đáp án trên

            02.256 - Tổng số tiền hoàn tối đa trong 1 kỳ sao kê cho 1 chủ thẻ của chương trình hoàn tiền theo tính năng
            thẻ TDQT Vietcombank JCB Platinum là bao nhiêu?

                      A.  300.000 VND/kỳ sao kê.
     119
                      B.  600.000 VND/kỳ sao kê.

                      C.  900.000 VND/kỳ sao kê.

                      D.  1.000.000 VND/kỳ sao kê.

     120    03.015 - Theo Quy định số 578/QĐ-VCB-MKTBL ngày 29/3/2024 về quy định triển khai CTKM, CSKHBL trong
             hệ thống VCB, các nguyên tắc chung khi triển khai chương trình khuyến mại là gì?

                      A.  Tuân thủ các quy định của pháp luật về xúc tiến thương mại và quy định của Vietcombank

                      B.  Thể lệ của chương trình khuyến mại phải thông báo công khai, minh bạch, rõ ràng và đảm bảo quy định
                          về bảo vệ quyền lợi khách hàng

                      C.  Các tư liệu truyền thông, quảng cáo cho chương trình phải tuân thủ quy định về nhận diện thương hiệu
                          của Vietcombank.

                      D.  Tất cả các đáp án trên

            02.059 - Theo Sản phẩm cho vay KHCN mua nhà ở/đất ở giá trị lớn tại QĐ 1355 ngày 13/7/2023 và các văn bản
            điều chỉnh/bổ sung có liên quan, quy định nào sau đây là đúng?

                      A.  100% thu nhập chứng minh trả nợ phải được chuyển khoản qua ngân hàng

     121              B.  Tối thiểu 20% thu nhập chứng minh trả nợ phải được chuyển khoản qua ngân hàng

                      C.  Trường hợp nguồn thu nhập từ lương để chứng minh trả nợ cho khoản vay: 100% thu nhập này phải
                          được chuyển khoản qua ngân hàng

                      D.  B&C

            03.020 - Theo Quy định số 578/QĐ-VCB-MKTBL ngày 29/3/2024 v/v quy định triển khai CTKM, CSKHBL tại
            VCB, Trụ sở chính tổ chức triển khai chương trình khuyến mại X và yêu cầu Chi nhánh phối hợp. Hoạt động
             nào sau đây của Chi nhánh là đúng?

                      A.  Phổ biến nội dung, quán triệt triển khai chương trình khuyến mại tới toàn bộ các điểm bán và cán bộ chi
                          nhánh
     122
                      B.  Truyền thông chương trình khuyến mại tới khách hàng và tận dụng cơ hội bán hàng

                      C.  Tiếp nhận, phối hợp xử lý vướng mắc, phản ánh của khách hàng, đối tác trong quá trình triển khai
                          CTKM

                      D.  Tất cả các đáp án trên

            02.062 - Theo Sản phẩm cho vay nhận chuyển nhượng Quyền sử dụng Đất hỗn hợp theo QĐ 789 ngày
             15/5/2024, mục đích vay vốn nào không được cho vay?

                      A.  Nộp tiền trúng đấu giá mua tài sản trong thi hành án dân sự theo Thông báo của Cơ quan thi hành án
                          dân sự về công nhận kết quả trúng đấu giá cho KH vay

     123              B.  Nộp tiền sử dụng Đất hỗn hợp theo Thông báo của CQNN về công nhận kết quả trúng đấu giá Quyền
                          sử dụng Đất hỗn hợp cho con đẻ của KH vay

                      C.  Vay bù đắp tiền nhận chuyển nhượng Quyền sử dụng đất hỗn hợp mà cá nhân đứng tên trên Giấy
                          chứng nhận là con đẻ của KH vay

                      D.  Cho vay nhận chuyển nhượng Quyền sử dụng Đất hỗn hợp, trong đó bên nhận chuyển nhượng là Bố
                          mẹ đẻ của KH vay

            03.024 - Tại thời điểm 18/6/2024, Vietcombank ra mắt ngân hàng số VCB Digibank với bao nhiêu giao diện?

                      A.  01 giao diện

     124              B.  02 giao diện

                      C.  03 giao diện, gồm Tiêu chuẩn, Priority và YouPro.

                      D.  04 giao diện

            02.063 - Theo Sản phẩm cho vay mua, xây sửa nhà ở kết hợp kinh doanh theo QĐ 103 ngày 17/1/2023, nguồn
            thu nhập từ sử dụng nhà để ở kết hợp kinh doanh của phương án vay vốn phải thỏa mãn điều kiện gì?

                      A.  Tỷ trọng nguồn thu nhập này trên tổng nguồn thu nhập để trả nợ khoản vay không quá 50%
     125
                      B.  Tỷ trọng nguồn thu nhập này trên tổng nguồn thu nhập để trả nợ khoản vay không quá 30%

                      C.  Tỷ trọng nguồn thu nhập này trên tổng nguồn thu nhập để trả nợ khoản vay chiếm tối thiểu 50%

                      D.  Tỷ trọng nguồn thu nhập này trên tổng nguồn thu nhập để trả nợ khoản vay chiếm tối thiểu 30%

            03.003 - Đơn vị nào tại TSC đầu mối tổ chức triển khai các chương trình khuyến mại dành cho khách hàng
             bán lẻ?

                      A.  Phòng Marketing Bán lẻ
     126
                      B.  Phòng Chính sách sản phẩm bán lẻ

                      C.  Phòng Phát triển sản phẩm bán lẻ

                      D.  Không đáp án nào đúng


            02.065 - Theo Sản phẩm cho vay Cán bộ VCB tiêu dùng có tài sản bảo đảm theo QĐ 1868 ngày 8/9/2023, Mức
            cho vay tối đa đối với Cán bộ VCB công tác tại VCB từ 10 năm trở lên được hưởng Lãi suất áp dụng cho Cán
             bộ VCB là?

                      A.  Cán bộ chuyên môn: 7 tỷ đồng
     127
                      B.  Cán bộ quản lý nhóm 1: 15 tỷ đồng

                      C.  Cán bộ chuyên môn: 4 tỷ đồng

                      D.  Cán bộ quản lý nhóm 2: 15 tỷ đồng

            03.029 - Tại thời điểm ra mắt dịch vụ Apple Pay tháng 8/2023, sản phẩm Thẻ nào do Vietcombank phát hành
            có thể liên kết thanh toán Apple Pay ?

                      A.  Thẻ ghi nợ nội địa

     128              B.  Thẻ Vietcombank Visa Thẻ Vietcombank Mastercard Thẻ Vietcombank JCB Thẻ Vietcombank American
                          Express

                      C.  Thẻ thương hiệu Visa

                      D.  Tất cả các thẻ của Vietcombank

            02.254 - Thời gian miễn lãi tối đa của thẻ tín dụng quốc tế Vietcombank JCB Platinum là bao nhiêu ngày?

                      A.  45 ngày

     129              B.  50 ngày

                      C.  55 ngày

                      D.  60 ngày

            03.030 - Vietcombank áp dụng biểu phí dịch vụ thông báo biến động số dư qua tin nhắn SMS mới tính theo
            sản lượng tin nhắn từ ngày nào ?

                      A.  01/01/2024
     130
                      B.  01/05/2024

                      C.  01/01/2023

                      D.  01/12/2023

            02.067 - Theo Sản phẩm cho vay Lãnh đạo BIDV theo QĐ 1691 ngày 01/10/2021 và các văn bản điều chỉnh/bổ
            sung có liên quan, Mức cho vay tối đa phục vụ đời sống bảo đảm bằng BĐS đối với Ban Giám đốc Chi nhánh
             BIDV được quy định như thế nào?

                      A.  30 lần thu nhập bình quân tháng từ lương, thưởng được trả qua tài khoản của 12 tháng liền kề thời điểm
     131                  vay vốn

                      B.  Tối đa 5 tỷ đồng/KH

                      C.  Tối đa 5 tỷ đồng/năm

                      D.  Đối với Nhóm KH1: tối đa 2 tỷ đồng. Đối với Nhóm KH2: tối đã 5 tỷ đồng

            03.001 - Theo Nghị định số Nghị định 81/2018/NĐ-CP ngày 22/5/2018, các nguyên tắc khi triển khai hoạt động
             khuyến mại cho khách hàng là gì?

                      A.  Hợp pháp, trung thực
     132
                      B.  Công khai, minh bạch

                      C.  Đảm bảo quyền, lợi ích hợp pháp của khách hàng

                      D.  Tất cả các đáp án trên

            02.071 - Theo Sản phẩm cho vay KHCN mua, hoàn thiện nhà dự án theo QĐ 2110 ngày 12/10/2023 và các văn
             bản điều chỉnh/bổ sung có liên quan, trường hợp nào sau đây không cho vay được theo Sản phẩm?

                      A.  KH vay 30 tỷ đồng để hoàn hiện căn hộ chung cư
     133
                      B.  KH vay bù đắp 25 tỷ đồng để hoàn thiện nhà dự án thấp tầng

                      C.  KH vay 20 tỷ đồng để hoàn thiện căn hộ chung cư

                      D.  A và B


            03.032 - Quyết định 2288/QĐ-VCB-MKTBL ngày 27/10/2023 quy định về nội dung gì?

                      A.  Quy định về việc gửi tin nhắn, thư điện tử, gọi điện thoại quảng cáo

     134              B.  Quy định về việc gửi tin nhắn, thư điện tử, gọi điện thoại quảng cáo và chăm sóc khách hàng

                      C.  Quy định về việc gửi tin nhắn, tin OTT, thư điện tử, gọi điện thoại quảng cáo

                      D.  Quy định về việc gửi tin nhắn, gửi tin OTT, gửi thư điện tử, gọi điện thoại quảng cáo và chăm sóc khách
                          hàng

            02.072 - Theo CV 18675 về bộ điều kiện cho vay tối thiểu áp dụng cho các Sản phẩm BĐS và các văn bản
            điều chỉnh/bổ sung có liên quan, trường hợp nào được coi là thỏa mãn quy định về Định nghĩa KH?

                      A.  01 cá nhân có tình trạng hôn nhân là chưa đăng ký kết hôn với ai tại thời điểm đề nghị vay vốn

     135              B.  02 cá nhân là vợ chồng nhưng có thể chưa hoàn tất thủ đục đăng ký ký kết hôn tại thời điểm thẩm định
                          và đề xuất cho vay

                      C.  01 cá nhân có tình trạng hôn nhân hiện tại là kết hôn song chỉ cá nhân đó giao kết Hợp đồng cho vay với
                          VCB khi thỏa mãn đồng thời các điều kiện cụ thể theo quy định của VCB

                      D.  Cả 3 phương án trên

            02.251 - Theo quy định của Vietcombank, một doanh nghiệp được phát hành tối đa bao nhiêu thẻ doanh
             nghiệp?

                      A.  Tối đa 01 thẻ chính và 03 thẻ phụ
     136
                      B.  Không giới hạn thẻ chính và thẻ phụ

                      C.  Tối đa 10 thẻ chính. Không giới hạn số lượng thẻ phụ

                      D.  Không giới hạn số lượng thẻ doanh nghiệp được phép phát hành. Thẻ doanh nghiệp không có thẻ phụ

            03.036 - Vietcombank thường xuyên gửi thông tin cảnh báo rủi ro, hướng dẫn giao dịch cho khách hàng qua
            các kênh nào?

                      A.  Website VCB
     137
                      B.  Fanpage VCB

                      C.  Email, OTT

                      D.  Tất cả đáp án trên đều đúng

            02.076 - Điều kiện Khách hàng cá nhân kinh doanh quy mô lớn là?

                      A.  Là cá nhân tự kinh doanh, chủ hộ kinh doanh, chủ sở hữu Doanh nghiệp tư nhân th/doanh nghiệp tư
                          nhân đáp ứng điều kiện: (i) Thực hiện kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thuỷ sản và
                          lĩnh vực công nghiệp, xây dựng có số lao động tham gia bảo hiểm xã hội bình quân năm từ 10 người trở
                          lên hoặc tổng doanh thu của năm trước liền kề 03 tỷ đồng trở lên. (ii) thực hiện kinh doanh trong lĩnh
                          vực thương mại, dịch vụ có số lao động tham giao bảo hiểm xã hội bình quân năm từ 10 người trởi lên
                          hoặc tổng doanh thu của năm liền kề từ 10 tỷ đồng trở lên.

                      B.  Là cá nhân tự kinh doanh, chủ hộ kinh doanh, chủ sở hữu Doanh nghiệp tư nhân đáp ứng điều kiện: (i)
                          Thực hiện kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thuỷ sản và lĩnh vực công nghiệp, xây
                          dựng có số lao động tham gia bảo hiểm xã hội bình quân năm từ 15 người trở lên hoặc tổng doanh thu
                          của năm trước liền kề 03 tỷ đồng trở lên. (ii) thực hiện kinh doanh trong lĩnh vực thương mại, dịch vụ có
                          số lao động tham giao bảo hiểm xã hội bình quân năm từ 15 người trởi lên hoặc tổng doanh thu của
     138                  năm liền kề từ 10 tỷ đồng trở lên.

                      C.  Là cá nhân tự kinh doanh, chủ hộ kinh doanh, chủ sở hữu Doanh nghiệp tư nhân đáp ứng điều kiện: (i)
                          Thực hiện kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thuỷ sản và lĩnh vực công nghiệp, xây
                          dựng có số lao động tham gia bảo hiểm xã hội bình quân năm từ 10 người trở lên hoặc tổng doanh thu
                          của năm trước liền kề 05 tỷ đồng trở lên. (ii) thực hiện kinh doanh trong lĩnh vực thương mại, dịch vụ có
                          số lao động tham giao bảo hiểm xã hội bình quân năm từ 10 người trởi lên hoặc tổng doanh thu của
                          năm liền kề từ 15 tỷ đồng trở lên.

                      D.  Là cá nhân tự kinh doanh, chủ hộ kinh doanh, chủ sở hữu Doanh nghiệp tư nhân đáp ứng điều kiện: (i)
                          Thực hiện kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thuỷ sản và lĩnh vực công nghiệp, xây
                          dựng có số lao động tham gia bảo hiểm xã hội bình quân năm từ 15 người trở lên hoặc tổng doanh thu
                          của năm trước liền kề 05 tỷ đồng trở lên. (ii) thực hiện kinh doanh trong lĩnh vực thương mại, dịch vụ có
                          số lao động tham giao bảo hiểm xã hội bình quân năm từ 15 người trởi lên hoặc tổng doanh thu của
                          năm liền kề từ 15 tỷ đồng trở lên.


             14.029 - Mức cho vay tối đa theo phương án kinh doanh quy định tại Sản phẩm An tâm kinh doanh dành cho
             Khách hàng cá nhân ban hành theo quy định hiện hành

                      A.  Tối đa 70% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB
     139
                      B.  Tối đa 75% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB

                      C.  Tối đa 80% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB

                      D.  Tối đa 85% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB

            02.077 - Theo quy định tại Sản phẩm An tâm kinh doanh và Kinh doanh tài lộc, điều kiện về độ tuổi khách
             hàng vay vốn sản xuất kinh doanh? Chọn phương án đầy đủ nhất.

                      A.  Khách hàng đủ từ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá
                          70 tuổi tại thời điểm kết thúc khoản cho vay

                      B.  Khách hàng đủ từ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá
     140                  65 tuổi tại thời điểm kết thúc khoản cho vay

                      C.  Khách hàng đủ từ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm; không quá 65
                          tuổi (đối với sản phẩm An tâm kinh doanh) và không quá 70 tuổi (đối với sản phẩm Kinh doanh tài lộc)
                          tại thời điểm kết thúc khoản cho vay

                      D.  Khách hàng đủ từ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá
                          75 tuổi tại thời điểm kết thúc khoản cho vay

             14.028 - Điều kiện về tuổi của Khách hàng quy định tại sản phẩm An tâm kinh doanh dành cho KHCN hiện
             hành

                      A.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 60 tuổi tại thời
                          điểm kết thúc cho vay

     141              B.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 65 tuổi tại thời
                          điểm kết thúc cho vay

                      C.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 70 tuổi tại thời
                          điểm kết thúc cho vay

                      D.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 75 tuổi tại thời
                          điểm kết thúc cho vay

            02.084 - KHCN đề nghị vay vốn để thực hiện bổ sung vốn lưu động kinh doanh tại làng nghề, CN thực hiện
            thẩm định điều kiện địa điểm kinh doanh bao gồm các nội dung gì?

                      A.  1. Địa điểm kinh doanh thuộc sở hữu hợp pháp của Khách hàng/thành viên Hộ kinh doanh/Doanh
                          nghiệp tư nhân 2.Địa điểm kinh doanh thuộc địa bàn diễn ra hoạt động sản xuất kinh doanh của làng
                          nghề.

                      B.  1. Địa điểm kinh doanh thuộc sở hữu, sử dụng hợp pháp của Khách hàng/thành viên Hộ kinh
                          doanh/Doanh nghiệp tư nhân 2.Địa điểm kinh doanh thuộc địa bàn diễn ra hoạt động sản xuất kinh
                          doanh của làng nghề
     142
                      C.  1. Địa điểm kinh doanh thuộc sở hữu, sử dụng hợp pháp của Khách hàng/thành viên Hộ kinh
                          doanh/Doanh nghiệp tư nhân 2.Địa điểm kinh doanh thuộc địa bàn diễn ra hoạt động sản xuất kinh
                          doanh của làng nghề 3.Đáp ứng các điều kiện bảo vệ môi trường làng nghề theo quy định của pháp luật
                          hiện hành

                      D.  1. Địa điểm kinh doanh thuộc sở hữu, sử dụng hợp pháp của Khách hàng/thành viên Hộ kinh
                          doanh/Doanh nghiệp tư nhân 2.Địa điểm kinh doanh thuộc địa bàn diễn ra hoạt động sản xuất kinh
                          doanh của làng nghề 3.Đáp ứng các điều kiện bảo vệ môi trường làng nghề theo quy định của pháp luật
                          hiện hành 4. Trường hợp Hộ kinh doanh/Doanh nghiệp tư nhân thuê địa điểm kinh doanh, Khách hàng
                          cung cấp Hợp đồng thuê địa điểm kinh doanh còn hiệu lực

             14.030 - Chọn phương án thuộc mục đích vay của sản phẩm Kinh doanh tài lộc dành cho KHCN hiện hành

                      A.  Kinh doanh cầm đồ có đăng ký kinh doanh

     143              B.  Kinh doanh bất động sản có đăng ký kinh doanh

                      C.  Kinh doanh quần áo online không đăng ký kinh doanh

                      D.  Kinh doanh sản xuất và thương mại men rượu có đăng ký kinh doanh

     144    02.085 - Theo quy định tại Sản phẩm cho vay trả nợ trước hạn KHCN Sản xuất kinh doanh, điều kiện đối với
             khoản vay cũ trong trường hợp khoản vay cũ là khoản vay trung dài hạn và nguồn trả nợ của Khoản vay cũ
            từ chính tài sản đầu tư hình thành từ vốn vay?

                      A.  Khoản vay cũ có đầy đủ tài liệu hồ sơ chứng minh số tiền TCTD cho vay đã được sử dụng để phục vụ
                          hoạt động Sản xuất kinh doanh của cá nhân tự kinh doanh/Hộ kinh doanh/Doanh nghiệp tư nhân do
                          khách hàng là chủ.

                      B.  Tài sản đầu tư hình thành từ vốn vay của Khoản vay cũ đáp ứng điều kiện: (i) đã hoàn thành đầu tư, đi
                          vào hoạt động; (ii) có đầy đủ tài liệu hồ sơ chứng minh phù hợp theo tiến độ thực hiện và thuộc quyền
                          sở hữu/sử dụng hợp pháp của cá nhân tự kinh doanh/Hộ kinh doanh/Doanh nghiệp tư nhân do khách
                          hàng là chủ.

                      C.  Tài sản đầu tư tạo dòng tiền đảm bảo khả năng trả nợ khi VCB thẩm định cho vay trả nợ trước hạn.

                      D.  A&B&C

             14.031 - Chọn phương án không thuộc mục đích vay của sản phẩm An tâm kinh doanh dành cho KHCN hiện
             hành

                      A.  Mua sắm ô tô tải phục vụ sản xuất kinh doanh

     145              B.  Xây dựng nhà xưởng sản xuất bánh kẹo

                      C.  Đầu tư hệ thống điện mặt trời mái nhà để bán điện cho EVN

                      D.  Thuê cửa hàng (hợp đồng thuê quy định tiền thuê phải thanh toán định kỳ là chi phí cho thời gian thuê là
                          24 năm)

            02.248 - Điều kiện nào sau đây không phải là điều kiện bắt buộc để khách hàng có thể đăng ký trả góp linh
             hoạt trên VCB Digibank?

                      A.  Giao dịch có giá trị từ 3.000.000 VND
     146
                      B.  Giao dịch đang ở trạng thái chờ sao kê

                      C.  Đơn vị chấp nhận thẻ đã ký kết hợp đồng hợp tác triển khai dịch vụ trả góp với Vietcombank

                      D.  Giao dịch của thẻ tín dụng cá nhân

             14.027 - Điều kiện về tuổi của Khách hàng quy định tại sản phẩm kinh doanh Tài lộc dành cho KHCN hiện
             hành

                      A.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 60 tuổi tại thời
                          điểm kết thúc cho vay

     147              B.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 65 tuổi tại thời
                          điểm kết thúc cho vay

                      C.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 70 tuổi tại thời
                          điểm kết thúc cho vay

                      D.  Đủ 18 tuổi trở lên tại thời điểm thẩm định, đề xuất cho vay theo sản phẩm và không quá 75 tuổi tại thời
                          điểm kết thúc cho vay

            02.086 - Theo quy định tại Sản phẩm cho vay trả nợ trước hạn KHCN Sản xuất kinh doanh, điều kiện đối với
             khoản vay cũ trong trường hợp khoản vay cũ là khoản vay ngắn hạn:

                      A.  Khoản vay cũ có đầy đủ tài liệu hồ sơ chứng minh số tiền TCTD cho vay đã được sử dụng để mua vật
                          tư, hàng hóa, thanh toán các chi phí hợp lý, hợp pháp, hợp lệ bổ sung vốn lưu động phục vụ hoạt động
                          Sản xuất kinh doanh của cá nhân tự kinh doanh/Hộ kinh doanh/Doanh nghiệp tư nhân do khách hàng là
                          chủ.

     148              B.  Phần giá trị hàng hóa, dịch vụ hình thành từ vốn vay của Khoản vay cũ đang thuộc khoản mục hàng tồn
                          kho và/hoặc khoản phải thu đảm bảo khả năng trả nợ khi VCB thẩm định cho vay trả nợ trước hạn.

                      C.  Phần giá trị hàng hóa, dịch vụ hình thành từ vốn vay của Khoản vay cũ đang thuộc khoản mục hàng tồn
                          kho và/hoặc khoản phải thu đảm bảo khả năng trả nợ khi VCB thẩm định cho vay trả nợ trước hạn. -
                          Phương án tiêu thụ hàng tồn kho là khả thi trong thời hạn cho vay đảm bảo nguồn thu để trả nợ. -
                          Trường hợp hàng đã bán nhưng chưa thu được tiền hàng: phương án thu hồi công nợ khả thi trong thời
                          hạn cho vay đảm bảo nguồn thu để trả nợ

                      D.  A&C

     149     14.032 - Tại sản phẩm An tâm kinh doanh dành cho KHCN hiện hành, Tỷ lệ đảm bảo trả nợ (DSCR – Debt
            service coverage ratio) phải đáp ứng

                      A.  DSCR ≤1 trong suốt thời gian vay vốn

                      B.  DSCR > 1 trong suốt thời gian vay vốn

                      C.  DSCR > 1,2 trong suốt thời gian vay vốn

                      D.   DSCR ≥ 1 trong suốt thời gian vay vốn

             02.089 - Khi thẩm định tài sản cố định KH vay vốn theo quy định tại Sản phẩm An tâm kinh doanh dành cho
             KHCN, CN cần lưu ý tài sản cố định không bao gồm (chọn đáp án đầy đủ nhất):

                      A.   1. Phương tiện thủy nội địa, tàu biển, tàu cá 2. Hệ thống điện mặt trời mái nhà 3.Cơ sở lưu trú du lịch

                       B.  1. Phương tiện thủy nội địa, tàu biển 2. Hệ thống điện mặt trời mái nhà 3. Cơ sở lưu trú du lịch
     150
                      C.   1. Phương tiện thủy nội địa, tàu biển, tàu cá. 2. Hệ thống điện mặt trời mái nhà 3.Cơ sở lưu trú du lịch.
                           4. Địa điểm kinh doanh

                      D.   1. Phương tiện thủy nội địa, tàu biển, tàu cá. 2. Hệ thống điện mặt trời mái nhà 3.Cơ sở lưu trú du lịch.
                           4. Địa điểm kinh doanh. 5. Các tài sản khác có nguyên giá của tài sản có giá trị từ 30.000.000 VND trở
                           lên

             14.033 - Điều kiện đối với khách hàng vay mua vàng nguyên liệu, vàng trang sức, mỹ nghệ phục vụ hoạt
             động kinh doanh mua bán vàng trang sức, mỹ nghệ theo quy định của VCB

                      A.   Là doanh nghiệp được thành lập theo quy định của pháp luật, có đăng ký hoạt động kinh doanh mua,
                           bán vàng trang sức, mỹ nghệ trong Giấy chứng nhận đăng ký doanh nghiệp và/hoặc thông tin công bố
                           trên Cổng thông tin quốc gia về đăng ký doanh nghiệp

     151               B.  Là doanh nghiệp được thành lập theo quy định của pháp luật, có Giấy chứng nhận đủ điều kiện sản xuất
                           vàng trang sức, mỹ nghệ của Ngân hàng nhà nước

                      C.   Là doanh nghiệp, cá nhân, hợp tác xã gia công vàng trang sức, mỹ nghệ có đăng ký gia công vàng trang
                           sức, mỹ nghệ trong Giấy chứng nhận đăng ký hộ kinh doanh, Giấy chứng nhân đăng ký hợp tác xã,
                           Giấy chứng nhận đăng ký doanh nghiệp và/hoặc thông tin công bố trên Cổng thông tin quốc gia về đăng
                           ký doanh nghiệp

                      D.   Cả A,B,C đều sai

             02.091 - Theo quy định tại Sản phẩm An tâm kinh doanh dành cho KHCN, thời gian ân hạn nợ gốc là?

                      A.   6 tháng

     152               B.  Tối đa 6 tháng

                      C.   3 tháng

                      D.   Tối đa 3 tháng

             14.034 - Các ngành nghề nào sau đây được cho vay SXKD theo sản phẩm An Tâm kinh doanh?

                      A.   Ngành nghề bị hạn chế theo chính sách tín dụng của VCB trong từng thời kỳ

     153               B.  Kinh doanh cầm đồ

                      C.   Kinh doanh Bất động sản

                      D.   Cả ba đáp án trên đều sai

             02.245 - Câu nào trong đây không đúng về sản phẩm thẻ Vietcombank Vietnam Airlines Platinum American
             Express?

                      A.   Cộng 1 dặm thưởng với mỗi 18.000 VND chi tiêu quốc tế và cộng 1 dặm thưởng với mỗi 22.000 VND chi
                           tiêu nội địa
     154
                       B.  Nhận ngay thẻ Priority Pass và miễn phí 2 lượt/năm vào phòng chờ thương gia tại sân bay cho chủ thẻ
                           chính và người thân

                      C.   Bảo hiểm chuyến đi lên đến 23,3 tỷ VND cho chủ thẻ và người thân

                      D.   Tặng thêm 5.000 dặm thưởng khi sử dụng thẻ từ 500 triệu VND/năm trở lên

             14.026 - Mức cho vay tối đa theo phương án kinh doanh quy định tại Sản phẩm kinh doanh tài lộc dành cho
             Khách hàng cá nhân ban hành theo quy định hiện hành (trường hợp thế chấp tài sản đảm bảo không có tính
             thanh khoản cao)

                      A.   Tối đa 70% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB
     155
                       B.  Tối đa 75% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB

                      C.   Tối đa 80% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB

                      D.   Tối đa 85% chi phí hợp lý để thực hiện phương án kinh doanh theo thẩm định của VCB


            02.092 - Theo quy định tại Sản phẩm Kinh doanh tài lộc dành cho KHCN, CN phải thực hiện rà soát đánh giá
             Hạn mức cho vay vào lúc nào?

                      A.  Trong vòng 01 tháng trước thời điểm hết thời gian duy trì hạn mức
     156
                      B.  Trong vòng 01 tháng trước thời điểm đến hạn của khoản giải ngân cuối cùng

                      C.  Trong vòng 01 tháng trước thời điểm đến hạn khỏan giải ngân đầu tiên

                      D.  Trong vòng 1 tháng trước thởi điểm tất toán khoản vay

             14.035 - Điều kiện về kết quả kinh doanh của DNTN theo sản phẩm An Tâm kinh doanh là?

                      A.  Kết quả kinh doanh sau thuế 12 tháng liền kề trước thời điểm thẩm định và đề xuất cho vay theo sản
                          phẩm thể hiện có lãi

     157              B.  Kết quả kinh doanh sau thuế 12 tháng liền kề trước thời điểm đề nghị vay vốn thể hiện có lãi

                      C.  Kết quả kinh doanh sau thuế 24 tháng liền kề trước thời điểm thẩm định và đề xuất cho vay theo sản
                          phẩm thể hiện có lãi

                      D.  Kết quả kinh doanh sau thuế 24 tháng liền kề trước thời điểm đề nghị vay vốn thể hiện có lãi

            02.100 - Theo mô hình tín dụng cho KHCN và SME siêu nhỏ tín dụng hiện hành, các khoản cấp tín dụng của
             khách hàng cá nhân tại PGD có thẩm quyền phê duyệt thuộc các cấp tại Trụ sở chính do ai thẩm định?

                      A.  Cán bộ thẩm định Phòng giao dịch

     158              B.  Cán bộ thẩm định phòng Khách hàng bán lẻ trụ sở Chi nhánh

                      C.  Cán bộ thẩm định phòng Khách hàng bán lẻ tại Trụ sở Chi nhánh thẩm định trước, Cán bộ rà soát rủi ro
                          tại P.PDTD trụ sở chính thẩm định lại

                      D.  Cán bộ thẩm định Trụ sở chính

             14.036 - Hộ kinh doanh cá thể phải nộp các loại thuế chính nào?

                      A.  Thuế môn bài

     159              B.  Thuế thu nhập cá nhân

                      C.  Thuế giá trị gia tăng

                      D.  Cả 3 đáp án trên

            02.102 - Theo mô hình tín dụng cho KHCN và SME siêu nhỏ tín dụng hiện hành, bộ phận nào có chức năng
             kiểm tra điều kiện giải ngân?

                      A.  Bộ phận quan hệ khách hàng

     160              B.  Bộ phận thẩm định tín dụng tại Chi nhánh đối với các khoản cấp tín dụng có thẩm quyền phê duyệt dưới
                          cấp Chuyên gia phê duyệt trở xuống, Bộ phận thẩm định tín dụng TSC đối với các khoản cấp tín dụng có
                          thẩm quyền phê duyệt từ cấp Chuyên gia phê duyệt trở lên

                      C.  Bộ phận quản lý nợ

                      D.  Bộ phận thẩm định tín dụng tại Chi nhánh

             14.025 - Những nhu cầu vốn nào sau đây không được cho vay theo quy định?

                      A.  Để kinh doanh dịch vụ cầm đồ

     161              B.  Để mua vàng miếng

                      C.  Để mua trái phiếu chính phủ

                      D.  Cả 3 đáp án đều đúng

            02.244 - Số tiền tối đa được hoàn theo tính năng ưu đãi của thẻ Vietcombank American Express Centurion là
             bao nhiêu?

                      A.  300.000 VND/kỳ sao kê
     162
                      B.  300.000 VND/quý

                      C.  2.000.000 VND/kỳ sao kê

                      D.  Không quy định số tiền tối đa

             14.037 - Hộ kinh doanh, cá nhân kinh doanh có doanh thu từ hoạt động sản xuất, kinh doanh trong năm
            dương lịch từ 100 triệu đồng trở xuống phải đóng thuế giá trị gia tăng bao nhiêu %?

                      A.  5%
     163
                      B.  10%

                      C.  20%

                      D.  Không phải nộp thuế giá trị gia tăng

            02.103 - Khách hàng nào dưới đây là Khách hàng SME nhỏ/siêu nhỏ tín dụng theo Công văn số 8411/VCB-
            CSKHBL-PTSPBL ngày 20/12/2022 v/v Quy định định danh phân khúc/phân nhóm KH SME?

                      A.  Doanh nghiệp SME nhỏ/siêu nhỏ có doanh thu thuần năm gần nhất 18 tỷ đồng, có tổng giá trị cấp tín
                          dụng và giá trị bảo lãnh cho bên thứ ba 4 tỷ đồng

     164              B.  Doanh nghiệp SME nhỏ/siêu nhỏ có doanh thu thuần năm gần nhất 10 tỷ đồng, có tổng giá trị cấp tín
                          dụng và giá trị bảo lãnh cho bên thứ ba 6 tỷ đồng

                      C.  Doanh nghiệp có doanh thu thuần năm gần nhất 25 tỷ đồng, có tổng giá trị cấp tín dụng và giá trị bảo
                          lãnh cho bên thứ ba 3 tỷ đồng

                      D.  Doanh nghiệp có doanh thu thuần năm gần nhất 25 tỷ đồng, có tổng giá trị cấp tín dụng và giá trị bảo
                          lãnh cho bên thứ ba 10 tỷ đồng

             14.038 - Nhận định nào sau đây đúng về địa điểm kinh doanh của hộ kinh doanh?

                      A.  Hộ kinh doanh được phép mở thêm chi nhánh, nhưng không có văn phòng đại diện

                      B.  Hộ kinh doanh có thể hoạt động kinh doanh tại các địa điểm khác nhau và có thể lựa chọn tối đa 2 địa
     165                  điểm để đăng ký trụ sở chính

                      C.  Hộ kinh doanh không được phép mở chi nhánh, nhưng có thể mở văn phòng đại diện

                      D.  Hộ kinh doanh có thể hoạt động kinh doanh tại các địa điểm khác nhau và phải lựa chọn một địa điểm
                          để đăng ký trụ sở chính và phải thông báo cho Cơ quan quản lý thuế, cơ quan quản lý thị trường nơi tiến
                          hành hoạt động kinh doanh đối với các địa điểm kinh doanh còn lại.

            02.104 - Theo quy trình tín dụng đối với KHBL tín dụng (QĐ số 2537/VCB-QLRRTD ngày 21/12/2022, trường
             hợp hồ sơ vay vốn đầy đủ, hợp lệ, cán bộ quản lý quan hệ khách hàng (CBKH) thực hiện đề xuất nhu cầu tín
            dụng dưới hình thức nào?

                      A.  Lập báo cáo đề xuất nhu cầu tín dụng
     166
                      B.  Thông báo cho cán bộ thẩm định nhu cầu tín dụng của khách hàng

                      C.  CBKH điền thông tin đề xuất nhu cầu tín dụng và ký xác nhận vào phần dành cho Ngân hàng tại mẫu
                          Phương án sử dụng vốn

                      D.  CBKH điền thông tin đề xuất nhu cầu tín dụng tại mẫu thông báo tác nghiệp đề xuất nhu cầu tín dụng

             14.024 - Đối tượng nào dưới đây được xác định là khách hàng kinh doanh quy mô lớn của sản phẩm kinh
            doanh Tài lộc dành cho KHCN hiện hành?

                      A.  A. Khách hàng kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thủy sản và lĩnh vực công nghiệp,
                          xây dựng có số lao động bình quân năm từ 10 người trở lên hoặc tổng doanh thu của năm trước liền kề
                          từ 3 tỷ đồng trở lên.

     167              B.  Khách hàng kinh doanh trong lĩnh vực nông nghiệp, lâm nghiệp, thủy sản và lĩnh vực công nghiệp, xây
                          dựng có số lao động tham gia bảo hiểm xã hội bình quân năm từ 10 người trở lên hoặc tổng doanh thu
                          của năm trước liền kề từ 3 tỷ đồng trở lên.

                      C.  Khách hàng kinh doanh trong lĩnh vực thương mại, dịch vụ có số lao động tham gia bảo hiểm xã hội
                          bình quân năm từ 10 người trở lên hoặc tổng doanh thu của năm trước liền kề từ 5 tỷ đồng trở lên.

                      D.  Khách hàng kinh doanh trong lĩnh vực thương mại, dịch vụ có số lao động tham gia bảo hiểm xã hội
                          bình quân năm từ 10 người trở lên hoặc tổng doanh thu của năm trước liền kề từ 7 tỷ đồng trở lên.

     168    02.109 - Theo hướng dẫn quy trình phát hành thẻ tín dụng trên RLOS, câu nào sau đây là đúng về các công
            việc tại bước tiếp nhận hồ sơ phát hành thẻ?

                      A.  a, Cán bộ khách hàng tiến hành khời tạo đề xuất nhu cầu tín dụng trên RLOS: nhập liệu thông tin (gồm
                          thông tin khách hàng, thông tin khoản vay), scan toàn bộ hồ sơ theo yêu cầu của quy định nghiệp vụ thẻ
                          và đính kèm hồ sơ lên RLOS b, Cán bộ khách hàng thực hiện tác vụ chuyển hồ sơ đi tiếp tới Cán bộ
                          thẩm định trên RLOS

                      B.  a, Cán bộ thẩm định tiến hành khời tạo đề xuất nhu cầu tín dụng trên RLOS: nhập liệu thông tin (gồm
                          thông tin khách hàng, thông tin khoản vay), scan toàn bộ hồ sơ theo yêu cầu của quy định nghiệp vụ thẻ
                          và đính kèm hồ sơ lên RLOS b, Cán bộ khách hàng thực hiện tác vụ chuyển hồ sơ đi tiếp tới Cán bộ
                          thẩm định trên RLOS

                      C.  a, Cán bộ thẩm định tiến hành khời tạo đề xuất nhu cầu tín dụng trên RLOS: nhập liệu thông tin (gồm
                          thông tin khách hàng, thông tin khoản vay), scan toàn bộ hồ sơ theo yêu cầu của quy định nghiệp vụ thẻ
                          và đính kèm hồ sơ lên RLOS b, Cán bộ thẩm định thực hiện tác vụ chuyển hồ sơ đi tiếp tới Cán bộ
                          khách hàng trên RLOS

                      D.  Cán bộ thẩm định tiến hành khời tạo đề xuất nhu cầu tín dụng trên RLOS: nhập liệu thông tin (gồm
                          thông tin khách hàng, thông tin khoản vay), scan toàn bộ hồ sơ theo yêu cầu của quy định nghiệp vụ thẻ
                          và đính kèm hồ sơ lên RLOS sau đó tự chuyển bước thẩm định hồ sơ phát hành thẻ

             14.039 - Thẩm định năng lực quản trị là thẩm định những nội dung gì?

                      A.  Trình độ chuyên môn

     169              B.  Uy tín, mối quan hệ của chủ doanh nghiệp

                      C.  Kinh nghiệm trong sản xuất, quản lý

                      D.  Tất cả các phương án trên

            02.111 - Cán bộ tại Chi nhánh được giao chỉ tiêu tăng trường 20 KH SME tín dụng trong năm 2024, theo
            anh/chị, cán bộ phải làm gì để hoàn thành chỉ tiêu?

                      A.  Chỉ tiêu quá nặng, báo cáo Lãnh đạo để điều chỉnh chỉ tiêu

     170              B.  Tra cứu thông tin doanh nghiệp trên website, gọi điện đến/đến từng doanh nghiệp để chào sản phẩm

                      C.  Đợi Khách hàng doanh nghiệp có nhu cầu tìm đến Chi nhánh

                      D.  Phối hợp cùng phòng Khách hàng bán buôn tại Chi nhánh để làm việc với các khách hàng doanh nghiệp
                          có chuỗi cung ứng đầu ra ổn định để tiếp và cận cấp tín dụng theo chuỗi

             14.040 - Ngành nghề kinh doanh nào sau đây không yêu cầu đăng ký kinh doanh theo quy định của pháp
             luật?

                      A.  Hộ gia đình kinh doanh dịch vụ lưu trú
     171
                      B.  Hộ gia đình làm muối

                      C.  Hộ gia đình kinh doanh lưu động

                      D.  Cả B và C đều đúng

            02.243 - Khách hàng phát hành thẻ Vietcombank eVer-link vào tháng 4/2024, khách hàng sử dụng thẻ để mua
             hàng hóa dịch vụ từ tháng 4/2024 đến tháng 3/2025 đạt doanh số 7.500.000 VNĐ. Tính số phí thường niên của
            thẻ Vietcombank eVer-link mà khách hàng phải trả cho kỳ thu phí tháng 4/2025.

                      A.  120.000 VND
     172
                      B.  90.000 VND

                      C.  60.000 VND

                      D.  Miễn phí

             14.041 - Khách hàng thu mua trái cây từ nhà vườn về đóng gói và bán cho đối tác. Thời gian thanh toán tiền
             mua trái cây cho nhà vườn tối đa 15 ngày kể từ ngày mua. Về phía đối tác, công nợ được thanh toán trả
            chậm trong vòng 60 ngày. Do đặc thù nông sản dễ hư hỏng nên thời gian tồn kho tối đa 5 ngày. Vòng quay
            vốn lưu động khi cấp tín dụng đối với khách hàng là bao nhiêu:

     173              A.  5,2 vòng

                      B.  7,3 vòng

                      C.  4,6 vòng

                      D.  4,9 vòng

     174    02.112 - Xu thế hiện nay của các Tổ chức tín dụng là ứng dụng công nghệ số trong các hoạt động ngân hàng
            để nâng cao hiệu quả hoạt động. Theo anh/chị, trong quá trình thẩm định và cho vay KH SME, đâu là cách
            thức thu thập thông tin tài chính của khách hàng phù hợp với xu thế ứng dụng công nghệ số hiện nay?

                      A.  Hợp tác và khai thác dữ liệu tài chính của khách hàng từ các nên tảng cung cấp các dịch vụ hỗ trợ quản
                          lý tài chính doanh nghiệp uy tín và danh tiếng trên thị trường.

                       B.  Tìm kiếm và sử dụng các thông tin tài chính của khách hàng trên Internet.

                       C.   Khai thác dựa trên các báo cáo tài chính đã được kiểm toán của các doanh nghiệp có cùng quy mô,
                            ngành nghề, lĩnh vực kinh doanh

                       D.  Tất cả các đáp án.

             14.023 - Trường hợp nào sau đây ngân hàng có thể cho vay phục vụ hoạt động sản xuất kinh doanh?

                       A.   Ông A có chứng chỉ hành nghề dược và đăng ký hộ kinh doanh nhà thuốc Tân Anh do ông A là chủ hộ
                            kinh doanh. Ông A đề nghị ngân hàng cho vay bổ sung vốn phục vụ hoạt động kinh doanh của nhà thuốc
                           Tân Anh.

                       B.   Ông A không có chứng chỉ hành nghề dược. Ông A thực hiện đăng ký hộ kinh doanh nhà thuốc Tân Anh
                           do ông A là chủ hộ kinh doanh. Ông A thuê ông B có chứng chỉ hành nghề dược chịu trách nhiệm
      175                  chuyên môn cho hộ kinh doanh nhà thuốc Tân Anh. Ông A đề nghị ngân hàng cho vay bổ sung vốn phục
                           vụ hoạt động kinh doanh của nhà thuốc Tân Anh.

                       C.   Ông A không có chứng chỉ hành nghề dược. Ông A thuê ông B có chứng chỉ hành nghề dược chịu trách
                            nhiệm chuyên môn và đứng tên trên giấy chứng nhận đăng ký hộ kinh doanh nhà thuốc Tân Anh (ông B
                            là chủ hộ kinh doanh nhà thuốc Tân Anh). Ông A đề nghị ngân hàng cho vay bổ sung vốn phục vụ hoạt
                           động kinh doanh của nhà thuốc Tân Anh.

                       D.  A và B

             02.114 - Đâu là kênh tiềm năng để Chi nhánh phát triển KH SME mới?

                       A.  Tiếp cận KH SME hiện hữu của Chi nhánh khác để lôi kéo về

      176              B.  Tiếp cận KH SME bị Tổ chức tín dụng khác từ chối cấp tín dụng

                       C.  Tiếp cận khách hàng cá nhân có quan hệ tín dụng tại VCB là chủ doanh nghiệp.

                       D.   Không có đáp án nào tiềm năng

             14.042 - Hộ kinh doanh A đang có hạn mức vay ngắn hạn 5 tỷ đồng tại BIDV để bồ sung vốn kinh doanh các
             mặt hàng vải. Dự kiến trong năm nay, chi phí cần để thực hiện phương án kinh doanh là 120 tỷ đồng, thời
             gian một vòng quay vốn là 2 tháng. Khách hàng dự kiến vẫn duy trì hạn mức 5 tỷ đồng tại BIDV, vốn tự có
             của HKD là 10 tỷ đồng. Hiện tại khách hàng đang có nhu cầu vay ngắn hạn tại VCB để bổ sung thêm vốn kinh
             doanh vải, số tiền VCB xác định cho HKD vay tối đa là bao nhiêu:
      177              A.  20 tỷ đồng

                       B.   15 tỷ đồng

                       C.   10 tỷ đồng

                       D.  5 tỷ đồng

             02.120 - Hiện tại VCB đang triển khai nhắc nợ tập trung đối với thẻ tín dụng cá nhân. Đơn vị nào tại Trụ sở
             chính có trách nhiệm thực hiện việc gọi điện nhắc nợ khách hàng và thông tin đến CN các yêu cầu của
             khách hàng mà đơn vị này ghi nhận được trong quá trình trao đổi nhắc nợ với khách hàng?

                       A.  Trung tâm quản lý vận hành bán lẻ
      178
                       B.   Phòng Quản lý nợ

                       C.  Trung tâm hỗ trợ khách hàng

                       D.   Phòng Công nợ

             14.043 - Khi thẩm định HKD, hồ sơ pháp lý cần phải thu thập bao gồm những hồ sơ nào trong các hồ sơ sau
             đây: (i) Hồ sơ pháp lý cá nhân: CMND/CCCD, xác nhận tình trạng hôn nhân, xác nhận thông tin cư trú (ii)
             Giấy chứng nhận đăng ký kinh doanh (iii) Thông tin mã số thuế được cấp cho hộ kinh doanh (iv) Giấy phép
             con áp dụng đối với ngành nghề kinh doanh có điều kiện (nếu có): Giấy chứng nhận an toàn vệ sinh thực
             phẩm, cam kết bảo vệ môi trường,… (v) Sổ sách, ghi chép theo dõi doanh thu, chi phí, hợp đồng kinh tế (nếu
             có)
      179
                       A.   (i), (ii), (iv), (v)

                       B.   (i), (ii), (iv)

                       C.   (i), (ii), (iii), (iv)

                       D.  Tất cả các hồ sơ nêu trên

      180    02.241 - Chủ thẻ sử dụng thẻ Vietcombank Visa Signature để mua vé máy bay, tuy nhiên chuyến bay bị trì
             hoãn liên tục trong 6 giờ so với lịch trình ban đầu, hỏi số tiền bảo hiểm mà đơn vị bảo hiểm phải bồi thường
            cho chủ thẻ là bao nhiêu (với giả thiết chủ thẻ đủ điều kiện được bồi hoàn theo quy định của Đơn vị bảo
             hiểm)?

                      A.  4,5 triệu VND

                      B.  1,5 triệu VND

                      C.  2,25 triệu VND

                      D.  3 triệu VND

             14.021 - Khách hàng A đề nghị VCB chi nhánh X cho vay; số tiền đề nghị vay từ 7-10 tỷ đồng với mục đích trả
             nợ trước hạn khoản vay đầu tư xây dựng trại chăn nuôi gà tại Ngân hàng Y. VCB chi nhánh X thực hiện cho
            vay theo phương án nào dưới đây là đúng?

                      A.  Cho vay theo sản phẩm cho vay KHCN để trả nợ trước hạn khoản vay phục vụ hoạt động sản xuất kinh
                          doanh tại các TCTD khác với điều kiện số tiền vay khách hàng đồng ý vay là 7 tỷ đồng
     181
                      B.  Cho vay không theo sản phẩm

                      C.  Làm việc với Khách hàng về số tiền vay đảm bảo đáp ứng quy định theo sản phẩm chuẩn " An tâm kinh
                          doanh" dành cho Khách hàng cá nhân và đáp ứng các quy định khác theo sản phẩm chuẩn của VCB về
                          Sản xuất kinh doanh.

                      D.  A và C đều đúng

            02.121 - Chủ thẻ cá nhân có thể yêu cầu VCB tăng hạn mức thẻ tín dụng tạm thời trong một thời gian nhất
            định nhưng không vượt quá:

                      A.  3 tháng
     182
                      B.  6 tháng

                      C.  12 tháng

                      D.  VCB không quy định thời gian tối đa của hiệu lực hạn mức tín dụng tạm thời

             14.044 - Tại thời điểm 31/12/2023, DNTN Y có Lợi nhuận sau thuế là 3 tỷ đồng, nợ phải trả 30 tỷ đồng, Vốn
            điều lệ doanh nghiệp là 10 tỷ đồng, lợi nhuận sau thuế chưa phấn phối kỳ trước là 2 tỷ đồng. Xác định tỷ lệ
            đòn bẩy của DNTN Y? Biết rằng DNTN Y trong năm 2023 không chia lợi nhuận.

                      A.  1,5 lần
     183
                      B.  2 lần

                      C.  2,5 lần

                      D.  Tất cả đều sai

            02.122 - Nhận định nào sau đây về thẩm định, phê duyệt phát hành thẻ tín dụng cá nhân là chưa chính xác?

                      A.  Cá nhân, bộ phận thực hiện chức năng thẩm định tín dụng phải độc lập với cá nhân, bộ phận có chức
                          năng bán hàng

     184              B.  Cá nhân, bộ phận thực hiện chức năng thẩm định tín dụng phải độc lập với cá nhân, bộ phận có chức
                          năng phê duyệt cấp tín dụng

                      C.  Giám đốc chi nhánh không được phê duyệt hạn mức tín dụng thẻ cho khách hàng nếu khách hàng này
                          đã bị hệ thống xếp hạng tín dụng nội bộ từ chối cấp hạn mức tín dụng

                      D.  Cán bộ thẩm định tại phòng Khách hàng có thể thẩm định tất cả các sản phẩm thẻ tín dụng

             14.045 - Điều kiện chăn nuôi lợn quy mô lớn theo quy định của Luật Chăn nuôi là gì?

                      A.  Vị trí xây dựng trang trại phù hợp với chiến lược phát triển kinh tế - xã hội của địa phương, vùng, chiến
                          lược phát triển chăn nuôi; đáp ứng yêu cầu về mật độ chăn nuôi quy định của pháp luật

     185              B.  Có đủ nguồn nước bảo đảm chất lượng cho hoạt động chăn nuôi và xử lý chất thải chăn nuôi

                      C.  Có biện pháp bảo vệ môi trường theo quy định của pháp luật về bảo vệ môi trường và có chuồng trại,
                          trang thiết bị chăn nuôi phù hợp với từng loại vật nuôi.

                      D.  Tất cả các đáp án đều đúng

     186    02.123 - Theo chương trình Lãi suất cho vay tín chấp đối với Người lao động ban hành kèm theo CV
            4606/VCB-PTSPBL.CSKHBL ngày 28/03/2024, mức lãi suất nội bộ được quy định như thế nào?

                      A.  Giảm 0,5%/năm so với mức lãi suất FPT theo quy định của Tổng Giám đốc trong từng thời kỳ đối với tất
                          cả các khoản vay tham gia chương trình

                      B.  Áp dụng mức lãi suất FPT theo quy định của Tổng Giám đốc trong từng thời kỳ

                      C.  Giảm 0,5%/năm so với mức lãi suất FPT theo quy định của Tổng Giám đốc trong từng thời kỳ đối với
                          các khoản vay ngắn hạn tham gia chương trình

                      D.  Giảm 0,5%/năm so với mức lãi suất FPT theo quy định của Tổng Giám đốc trong từng thời kỳ đối với
                          các khoản vay trung hạn tham gia chương trình

             13.006 - Khách hàng A sở hữu 2 hộ kinh doanh đang hoạt động. Một hộ kinh doanh sơn nước được đăng kí
             bằng số căn cước công dân và Một hộ kinh doanh sàn gỗ được đăng kí bằng số CMND. Hai hộ kinh doanh
            có 2 mã số thuế khác nhau. Khách hàng dự định vay mỗi hộ kinh doanh 10 tỷ đồng theo sản phẩm chuẩn hộ
             kinh doanh quy mô nhỏ. Cán bộ đánh giá hoạt động kinh doanh của khách hàng ổn định, phương án kinh
            doanh khả thi, hiệu quả và nhu cầu vốn phù hợp, có thể cấp tín dụng. Theo bạn, việc CBTĐ đề xuất hạn mức
            vay vốn cho khách hàng A theo đề nghị của khách hàng có đúng quy định không?
     187              A.  Khách hàng có thể vay được theo 2 hộ kinh doanh riêng biệt

                      B.  Không cho vay do một mình khách hàng kinh doanh cả hai mặt hàng, ngân hàng không quản lý được sử
                          dụng vốn của khách hàng

                      C.  Khách hàng không vay được 2 hộ kinh doanh do mỗi cá nhân chỉ được đăng kí một hộ kinh doanh

                      D.  Chỉ cấp 1 hạn mức vay vốn kinh doanh cho khách hàng đối với cả hai mục đích hoạt động.

            02.124 - Sản phẩm cho vay tín chấp đối với Người lao động (theo Quyết định số 99/QĐ-VCB-PTSPBL ngày
            01/02/2023 và các văn bản sửa đổi bổ sung) áp dụng cho đối tượng khách hàng nào?

                      A.  Người lao động/cán bộ/công chức/viên chứccông tác tại các Đơn vị sử dụng lao động có thu nhập từ
                          lương được trả qua tài khoản thanh toán

                      B.  Người lao động/cán bộ/công chức/viên chứccông tác tại các Đơn vị sử dụng lao động có thu nhập từ
     188                  lương được trả qua tài khoản thanh toán mở tại VCB

                      C.  Người lao động/cán bộ/công chức/viên chức công tác tại các Đơn vị sử dụng lao động có thu nhập từ
                          lương được trả qua tài khoản thanh toán mở tại VCB và một số TCTD uy tín theo quy định của VCB
                          trong từng thời kỳ

                      D.  Người lao động/cán bộ/công chức/viên chứccông tác tại các Đơn vị sử dụng lao động có thu nhập từ
                          lương được trả qua tài khoản thanh toán hoặc bằng tiền mặt

             13.007 - Hồ sơ chứng minh mục đích sử dụng vốn nào sau đây là chưa đầy đủ và không hợp lệ

                      A.  Hộ kinh doanh giải ngân với doanh số lớn dựa trên hóa đơn bán lẻ, hợp đồng nguyên tắc, biên bản giao
                          hàng nhưng chứng từ thiếu thông tin pháp lý của người thụ hưởng

                      B.  Hộ kinh doanh nhà hàng ăn uống giải ngân thanh toán tiền mua thực phẩm cho nhà cung cấp nhưng khi
     189                  tra cứu Mã số thuế bên thụ hưởng là đơn vị hoạt động trong lĩnh vực thiết bị xây dựng

                      C.  Hợp đồng mua bán có điều khoản Khách hàng tạm ứng trước 30%, Khách hàng thanh toán 70% giá trị
                          còn lại hợp đồng sau khi nhận đủ hàng hóa, hồ sơ giải ngân Khách hàng cung cấp gồm: Hợp đồng mua
                          bán, chứng từ thể hiện đã thanh toán tiền tạm ứng 30% giá trị hợp đồng, hóa đơn.

                      D.  Tất cả các đáp án trên

            02.240 - Thẻ Vietcombank American Express (hạng Vàng và hạng Chuẩn) là loại thẻ được hưởng quyền lợi
             bảo hiểm chuyến đi tối đa mức bao nhiêu?

                      A.  23,3 tỷ VND
     190
                      B.  11,65 tỷ VND

                      C.  7 tỷ VND

                      D.  6,65 tỷ VND


             13.008 - Chi nhánh giải ngân số tiền 3 tỷ đồng cho hộ kinh doanh vật liệu xây dựng để ứng trước tiền nhập
             hàng hóa, các dấu hiệu nào cho thấy khoản giải ngân có thể đã bị sử dụng sai mục đích

                      A.  Sao kê tài khoản của chủ hộ kinh doanh ngay sau ngày giải ngân có khoản tiền tương đương số tiền giải
                          ngân chuyển vào tài khoản.

     191              B.  Kiểm tra sổ sách ghi chép của hộ kinh doanh tại ngày giao hàng theo Hợp đồng mua bán cho thấy
                          không ghi nhận tăng lượng hàng tồn kho như số lượng theo HĐMB.

                      C.  Thu thập sao kê của vợ khách hàng tại ngân hàng khác cho thấy cùng ngày giải ngân có hoạt động nộp
                          tiền mặt với số tiền tương đương số tiền giải ngân

                      D.  Tất cả các đáp án trên

            02.125 - Khoản vay theo sản phẩm cho vay theo hạn mức thấu chi được phê duyệt trước do Chi nhánh thực
             hiện dành cho KHCN thuộc thẩm quyền phê duyệt tín dụng của cấp nào?

                      A.  Lãnh đạo Phòng Khách hàng/Lãnh đạo Phòng Khách hàng bán lẻ/Lãnh đạo Phòng giao dịch

     192              B.  Giám đốc Chi nhánh

                      C.  Lãnh đạo Phòng Khách hàng/Lãnh đạo Phòng Khách hàng bán lẻ

                      D.  Lãnh đạo Phòng Khách hàng/Lãnh đạo Phòng Khách hàng bán lẻ/Lãnh đạo Phòng giao dịch/Giám đốc
                          Chi nhánh tùy theo giá trị khoản vay.

             13.009 - Chọn đáp án đúng nhất: Khách hàng A đang được VCB cho vay vốn ngắn hạn phục vụ hoạt động
            sản xuất đồ dùng 1 lần với thời hạn vay vốn của mỗi khoản giải ngân phù hợp với vòng quay vốn lưu động
             là 9 tháng. Khách hàng đề nghị được vay vốn thêm để phục vụ hoạt động kinh doanh nhà hàng ăn uống với
            vòng quay vốn lưu động theo tính toán là 4 vòng. Trong vai trò là CBTĐ của khoản vay, bạn có đánh giá như
            thế nào về thời hạn vay vốn của khách hàng?

                      A.  Một khách hàng cá nhân vay vốn phục vụ hoạt động sản xuất kinh doanh tại VCB chỉ được ký hợp đồng
                          hạn mức với một thời hạn vay vốn. Để giúp khách hàng đảm bảo khả năng thanh toán các khoản đến
                          hạn, VCB để thời hạn 9 tháng đối với cả 2 phương án vay là phù hợp.
     193
                      B.  Cho vay theo phương án sản xuất đồ dùng 1 lần vay vốn với thời hạn của mỗi khoản giải ngân là 9
                          tháng, phương án kinh doanh nhà hàng ăn uống vay vốn với thời hạn của mỗi khoản giải ngân là 3
                          tháng

                      C.  Ký một Hợp đồng hạn mức theo nhu cầu vốn của khách hàng, thời hạn 6 tháng/từng khoản giải ngân đối
                          với cả 2 phương án vay là phù hợp.

                      D.  Cả B và C đều có thể áp dụng được với khách hàng này, tùy theo nhu cầu của Khách hàng để đưa ra
                          thời hạn vay vốn

            02.126 - Theo quy định về phát hành thẻ tín dụng cá nhân theo hệ thống chấm điểm xếp hạng tín dụng nội
             bộ, đối với nhóm sản phẩm thẻ tín dụng không có bảo đảm, thẩm quyền phê duyệt hạn mức tín dụng của
            Giám đốc chi nhánh là bao nhiêu?

                      A.  3 tỷ
     194
                      B.  4 tỷ

                      C.  5 tỷ

                      D.  6 tỷ

     195    02.128 - Theo bộ quy định về hoạt động thẻ hiện hành của VCB, câu nào sau đây là đúng đối với quy định về
             phân loại nợ đối với thẻ tín dụng công ty?

                      A.  Sau ngày đến hạn thanh toán, nếu công ty không thanh toán toàn bộ số dư nợ sao kê (đối với thẻ miễn
                          lãi) hoặc không thanh toán đủ số tiền thanh toán tối thiểu (đối với các thẻ tín dụng công ty khác) theo
                          quy định, VCB sẽ chuyển toàn bộ dư nợ gốc của công ty thành nợ quá hạn và thực hiện phân loại nợ
                          theo quy định của VCB và NHNN trong từng thời kỳ

                      B.  Sau ngày đề nghị thanh toán, nếu công ty không thanh toán toàn bộ số dư nợ sao kê (đối với thẻ miễn
                          lãi) hoặc không thanh toán đủ số tiền thanh toán tối thiểu (đối với các thẻ tín dụng công ty khác) theo
                          quy định, VCB sẽ chuyển toàn bộ dư nợ gốc của công ty thành nợ quá hạn và thực hiện phân loại nợ
                          theo quy định của VCB và NHNN trong từng thời kỳ

                      C.  Sau ngày đến hạn thanh toán, nếu công ty không thanh toán đủ số tiền thanh toán tối thiểu theo quy
                          định, VCB sẽ chuyển toàn bộ dư nợ gốc của công ty thành nợ quá hạn và thực hiện phân loại nợ theo
                          quy định của VCB và NHNN trong từng thời kỳ

                      D.  Sau 10 ngày kể từ ngày đến hạn thanh toán , nếu công ty không thanh toán toàn bộ số dư nợ sao kê
                          (đối với thẻ miễn lãi) hoặc không thanh toán đủ số tiền thanh toán tối thiểu (đối với các thẻ tín dụng công
                          ty khác) theo quy định, VCB sẽ chuyển toàn bộ dư nợ gốc của công ty thành nợ quá hạn và thực hiện
                          phân loại nợ theo quy định của VCB và NHNN trong từng thời kỳ

             13.005 - Hộ kinh doanh A kinh doanh mặt hàng vải may mặc ở chợ Ninh Hiệp có doanh thu 50 tỷ đồng, tài sản
             bảo đảm là bất động sản trị giá 50 tỷ đồng. Khách hàng dự định vay số tiền 20 tỷ đồng tại VCB. Khách hàng
            cung cấp đầy đủ hồ sơ theo quy định cho vay hộ kinh doanh của VCB. Qua trao đổi với khách hàng, ngoài
             kinh doanh mặt hàng vải, cán bộ nhận thấy khách hàng còn góp vốn vào các Công ty khác để làm ăn. CBTĐ
            đề nghị khách hàng cung cấp thông tin các Công ty để đánh giá tổng thể khả năng trả nợ của khách hàng,
            tuy nhiên khách hàng lấy lý do đây là khoản vay hộ kinh doanh không liên quan gì đến Công ty. Trong trường
             hợp này CBTĐ nên làm gì?

                      A.  Đồng ý với khách hàng do khoản vay này không liên quan gì đến Công ty và thẩm định theo quy định về
     196                  cho vay hộ kinh doanh của VCB

                      B.  Đồng ý với khách hàng, không cần tìm hiểu nhiều do khách hàng đáp ứng quy định cho vay Hộ kinh
                          doanh, có tài sản thế chấp tốt, tỷ lệ cho vay trên TSBĐ ở mức an toàn.

                      C.  Hỏi tin vai trò cá nhân của khách hàng để biết khách hàng góp vốn ở những Công ty nào, tra CIC Công
                          ty đó, tìm hiểu thêm từ các nguồn thông tin khác để có cơ ở đánh giá tốt hơn về năng lực cũng như rủi
                          ro tiềm ẩn của khách hàng trước khi đưa ra quyết định đề xuất cấp tín dụng

                      D.  Không đồng ý cấp tín dụng do khách hàng không cung cấp các thông tin, hồ sơ theo yêu cầu của cán bộ
                          thẩm định

            02.237 - Tính tổng số tiền cashback KH được nhận khi sử dụng thẻ VCB DigiCard từ ngày 21/05/2024 đến
            20/06/2024 cho các giao dịch như sau: - 01 giao dịch 10.000.000 VND tại Facebook (đơn vị thuộc lĩnh vực
            Quảng cáo có MCC 7311) - 01 giao dịch 6.500.000 VND tại Grab (đơn vị thuộc lĩnh vực Đặt xe, dịch vụ vận
            chuyển trực tuyến MCC 4121) - 1 giao dịch 2.500.000 VND tại Winmart (đơn vị thuộc lĩnh vực siêu thị MCC
            5411) - 1 giao dịch nhận tiền hoàn thuế 1.000.000 VND tại Global Blue Tax Free Stockholm (đơn vị có MCC
            9311)
     197
                      A.  305.000 VND

                      B.  605.000VND

                      C.  255.000 VND

                      D.  550.000 VND

             13.010 - Khách hàng A là chủ hộ kinh doanh A, đề nghị vay vốn tại VCB để phục vụ cho hoạt động thương
             mại bàn ghế inox. Hàng hóa đầu vào của hộ kinh doanh A chủ yếu đều nhập bàn ghế được sản xuất gia công
            từ doanh nghiệp tư nhân B do con trai của khách hàng A làm chủ sở hữu (DNTN B không vay vốn). 2 kho
             hàng của ông A và con trai đang được đặt tại mảnh đất của gia đình có diện tích 1200 m2. Câu nào là đúng
             nhất khi xác định nhu cầu vốn của khách hàng A?

                      A.  Cần thẩm định kế hoạch kinh doanh tổng thế và tình hình tài chính của nhóm gồm hộ kinh doanh A và
     198                  doanh nghiệp tư nhân B để làm cơ sở cấp tín dụng

                      B.  Hộ kinh doanh A và doanh nghiệp tư nhân B có chủ sở hữu không phải quan hệ vợ/chồng, do đó có sự
                          tách bạch về hoạt động kinh doanh nên không được coi là nhóm khách hàng.

                      C.  Hộ kinh doanh A hoạt động kinh doanh chính là thương mại, DNTN B hoạt động kinh doanh chính là sản
                          xuất, do đó có sự tách bạch về hoạt động kinh doanh nên không được coi là nhóm khách hàng.

                      D.  Cả B, C đều đúng

            02.129 - Theo bộ quy định về hoạt động thẻ hiện hành của VCB, thẻ tín dụng công ty có hiệu lực là bao nhiêu
             năm?

                      A.  3 năm
     199
                      B.  4 năm

                      C.  5 năm

                      D.  6 năm

     200     13.011 - Công ty CP Đầu tư và thương mại Ánh Sáng cung cấp hồ sơ vay vốn cho VCB, trong đó có các hồ
            sơ sau: - GCN ĐKKD, người đại diện pháp luật là ông Nguyễn Ánh Dương – Tổng giám đốc Công ty - Báo
            cáo tài chính 2023, 2024 ký bởi bà Trần Sao Mai – Giám đốc tài chính Công ty - Phương án vay vốn VCB ký
             bởi ông Nguyễn Văn Lợi – Giám đốc đầu tư Công ty Để xác định người có thẩm quyền ký kết các hồ sơ vay
            vốn cho VCB, anh/chị nên làm gì?

                      A.  Chấp thuận các hồ sơ trên vì các hồ sơ đã được ký bởi người có thẩm quyền

                      B.  Yêu cầu công ty cung cấp lại BCTC và phương án vay vốn ký bởi ông Nguyễn Ánh Dương

                      C.  Yêu cầu công ty bổ sung văn bản ủy quyền của ông Nguyễn Ánh Dương cho bà Trần Sao Mai và ông
                          Nguyễn Văn Lợi được ký các hồ sơ vay vốn VCB

                      D.  Thu thập thêm các hồ sơ pháp lý công ty như Điều lệ, biên bản họp và nghị quyết HĐQT v/v cử người
                          đại diện đi vay vốn VCB, quyết định bổ nhiệm các chức danh, các văn bản nội bộ quy định về thẩm
                          quyền các chức danh của Công ty, các văn bản ủy quyền cho người ký trên các hồ sơ cung cấp cho
                          VCB.

            02.131 - Chiến lược nào sau đây phù hợp để Ngân hàng có thể duy trì và phát triển mối quan hệ với KH SME
             hiện tại?

                      A.  Chỉ thăm hỏi, tương tác với khách hàng qua điện thoại, email,..

     201              B.  Chăm sóc khách hàng sau bán tận tình, thường xuyên làm việc trực tiếp với KH, cập nhật chính sách
                          mới và ưu đãi liên quan tới khách hàng

                      C.  Tập trung phát triển sản phẩm và dịch vụ mới

                      D.  Cả A&C

             13.004 - Hộ kinh doanh A hiện đang kinh doanh dịch vụ ăn uống trên địa bàn Hà Nội và đang có nhu cầu vay
            vốn tại VCB để bổ sung vốn lưu động. Sau khi trao đổi và đi thẩm định khách hàng, cán bộ thẩm định chỉ
             nhận được các hồ sơ khách hàng cung cấp gồm: Giấy chứng nhận đăng ký hộ kinh doanh (mới được cơ
            quan có thẩm quyền cấp cách thời gian thẩm định 04 tháng), sổ sách bán hàng, chứng từ nộp thuế theo quy
            định của nhà nước, hợp đồng thuê địa điểm kinh doanh. Gỉa thiết những điều kiện khác (Chất lượng tín
            dụng, Phương án vay vốn, kết quả kinh doanh, Tài sản bảo đảm) đáp ứng quy định của VCB, là cán bộ thẩm
            định bạn thấy đã đủ hồ sơ để ra quyết định cho vay chưa? nếu chưa thì yêu cầu khách hàng cung cấp thêm
     202     hồ sơ gì?

                      A.  Đã đủ hồ sơ để ra quyết định cho vay

                      B.  Chưa đủ hồ sơ để ra quyết định cho vay. Yêu cầu khách hàng bổ sung hồ sơ về điều kiện kinh doanh

                      C.  Không cho vay được do thời gian hoạt động kinh doanh của khách hàng dưới 12 tháng tính đến thời
                          điểm thẩm định

                      D.  không có đáp án đúng

            02.150 - Đối tượng gửi tiết kiệm tại VCB:

                      A.  Khách hàng cá nhân là người cư trú (người Việt Nam, người nước ngoài)

     203              B.  Khách hàng cá nhân, tổ chức là ngưởi cư trú

                      C.  Khách hàng là cá nhân Việt Nam cư trú

                      D.  Khách hàng là công dân Việt Nam

             13.012 - Công ty A có ngành nghề kinh doanh siêu thị hàng tiêu dùng. Bà B - chủ hộ kinh doanh chuyên kinh
            doanh mỹ phẩm, đang có dư nợ cá nhân tại VCB 50 tỷ đồng để mua bất động sản, TSBĐ là biệt thự tại Hồ
            Tây trị giá 100 tỷ đồng. Công ty A đề nghị vay vốn VCB 20 tỷ đồng để bổ sung vốn kinh doanh và bà B mặc
            dù không tham gia góp vốn và làm việc tại công ty A nhưng vẫn đồng ý dùng TSBĐ nêu trên đảm bảo đồng
            thời cho khoản vay công ty A do có quan hệ thân quen với chủ công ty A. Trường hợp công ty A đáp ứng
            đầy đủ các quy định cho vay của VCB, CBTĐ có cần lưu ý gì trong việc nhận TSBĐ nói trên hay không?

                      A.  Công ty A và khách hàng B có mục đích vay vốn khác nhau nên việc nhận TSBĐ nêu trên không vi phạm
     204                  quy định của VCB, không cần lưu ý thêm gì.

                      B.  Cần đánh giá có giao dịch mua bán kinh doanh giữa công ty A và hộ kinh doanh do khách hàng B làm
                          chủ để xác định lý do thực sự việc khách hàng B dùng chung tài sản cá nhân đảm bảo cho công ty A.

                      C.  Không nhận tài sản nêu trên của khách hàng cá nhân B do bà B không phải là phải là thành viên góp
                          vốn của công ty A.

                      D.  Có thể nhận tài sản nêu trên của khách hàng cá nhân B với tỷ lệ cho vay thấp hơn so với quy định tỷ lệ
                          TSBĐ tối thiểu của VCB để đảm bảo an toàn vốn vay.

            02.151 - Ngày đến hạn của thẻ tiết kiệm có kỳ hạn trùng với ngày nghỉ, ngày lễ, việc chi trả lãi/gốc đuợc chi
            trả vào ngày nào?

                      A.  Tại ngày đến hạn (không phân biệt ngày làm việc,ngày nghỉ, ngày lễ)
     205
                      B.  Tại ngày làm việc truớc ngày nghỉ

                      C.  Tại ngày làm việc tiếp theo đầu tiên của VCB

                      D.  Trả lãi vào ngày đến hạn, trả gốc vào ngày làm việc tiếp theo đầu tiên của VCB


             13.013 - Khách hàng SME tại Bắc Giang hoạt động sản xuất thùng xốp, đối tác đầu ra của khách hàng chủ
            yếu là các hộ gia đình trồng vải trên địa bàn tỉnh (các hộ gia đình mua để đựng vải đã thu hoạch). Rủi ro cho
            vay khách hàng này là gì?

                      A.  Thị trường tiêu thụ nhỏ, không ổn định vì vậy nguồn trả nợ không đảm bảo

     206              B.  Khách hàng kinh doanh có tính mùa vụ cao vì vậy cần xác định đúng nhu cầu vốn và thời điểm sử dụng
                          vốn của khách hàng để đảm bảo khách hàng không sử dụng vốn vay sai mục đích.

                      C.  Sản phẩm của khách hàng đơn giản, dễ sản xuất, vì vậy việc bán hàng gặp nhiều khó khăn, khả năng
                          trả nợ sẽ không đảm bảo.

                      D.  Cả 3 phương án trên.

            02.235 - Chủ thẻ tín dụng Vietcombank Visa Platinum được tặng 1 triệu VND theo tính năng ưu đãi Sinh nhật
            vàng nếu đạt điều kiện nào sau đây về doanh số chi tiêu?

                      A.  Có ít nhất 01 giao dịch chi tiêu từ 10.000.000 VND (mười triệu đồng) trong vòng 03 tháng trước và trong
                          ngày sinh nhật của chủ thẻ chính.

     207              B.  Có ít nhất 01 giao dịch chi tiêu từ 10.000.000 VND (mười triệu đồng) vào đúng ngày sinh nhật của chủ
                          thẻ chính.

                      C.  Có ít nhất 01 giao dịch chi tiêu từ 30.000.000 VND (ba mươi triệu đồng) trong vòng 03 tháng trước và
                          trong ngày sinh nhật của chủ thẻ chính.

                      D.  Có ít nhất 01 giao dịch chi tiêu từ 30.000.000 VND (ba mươi triệu đồng) vào đúng ngày sinh nhật của
                          chủ thẻ chính.

             13.003 - Khách hàng A hiện đang buôn chuyến mặt hàng Quần áo từ Móng Cái về chợ Ninh Hiệp và đang có
             nhu cầu vay vốn tại VCB để bổ sung vốn nhập hàng cho chuyến hàng sắp tới. Hỏi là cán bộ thẩm định, bạn
            sẽ yêu cầu khách hàng cung cấp hồ sơ gì để chứng minh hoạt động kinh doanh của khách hàng đã được
            cấp phép?

                      A.  Giấy chứng nhận đăng ký hộ kinh doanh
     208
                      B.  (i) Giấy chứng nhận đăng ký hộ kinh doanh (ii) Giấy chứng nhận địa điểm kinh doanh

                      C.  Xác nhận của chính quyền địa phương nơi cư trú của khách hàng về hoạt động kinh doanh của khách
                          hàng

                      D.  Không cần yêu cầu Hồ sơ cấp phép kinh doanh

            02.156 - Nguồn tiền gửi vào tài khoản tiền gửi có kỳ hạn gồm?

                      A.  Tiền mặt, chuyển từ tài khoản thanh toán của chính khách hàng

     209              B.  Tiền mặt, chuyển từ tài khoản thanh toán

                      C.  Tiền mặt

                      D.  Chuyển khoản từ tài khoản thanh toán của chính khách hàng

             13.014 - Khách hàng SME kinh doanh các mặt hàng tiêu dùng (siêu thị mini) tại một thành phố lớn và sao kê
            các tài khoản ngân hàng hầu như đều là giao dịch nộp tiền mặt, khách hàng vay cho biết người tiêu dùng
            chủ yếu vẫn sử dụng tiền mặt trong giao dịch mua hàng, cán bộ thẩm định đánh giá có phù hợp hay không?

                      A.  Cán bộ cho rằng thói quen chi tiêu của người dân phần lớn là tiền mặt, do đó Công ty nộp tiền mặt vào
                          tài khoản là hợp lý
     210
                      B.  Cán bộ quan sát thấy tại quầy thu ngân siêu thị có mã QR, POS, do đó cần trao đổi với nhân viên thu
                          ngân để tìm hiểu thêm về thói quen chi tiêu của khách hàng

                      C.  Đối chiếu và xác định tính khớp đúng giữa doanh số thu bán hàng hàng ngày và sổ theo dõi thu chi tiền
                          mặt của Công ty

                      D.  Cả B và C

     211    02.157 - Với sản phẩm Tiền gửi rút gốc linh hoạt, nhận định nào sau đây không chính xác?

                      A.  Khách hàng được linh hoạt rút tiền trong kỳ hạn gửi.

                      B.  Lãi suất áp dụng cho phần gốc rút trước hạn bằng trần lãi suất rút trước hạn VND quy định tại Quyết
                          định về Lãi suất khung của VCB áp dụng đối với khách hàng cá nhân tại thời điểm khách hàng rút trước
                          hạn tiền gửi.

                      C.  Lãi suất áp dụng cho phần gốc rút trước hạn bằng trần lãi suất rút trước hạn VND quy định tại Quyết
                          định về Lãi suất khung của VCB áp dụng đối với khách hàng cá nhân tại thời điểm khách hàng gửi tiền.


                      D.  Phần gốc còn lại tiếp tục áp dụng lãi suất của tài khoản xác định tại đầu kỳ.

             13.015 - Khách hàng doanh nghiệp SME X có giao dịch mua, bán đồng thời với một số đối tác, theo tìm hiểu
             của CBTĐ thì các đối tác này đều là khách hàng liên quan với khách hàng (không vay vốn tại VCB), CBTĐ
             cần lưu ý gì khi xác định nhu cầu vốn khách hàng?

                      A.  CBTĐ cần loại trừ toàn bộ doanh thu từ các bên liên quan khi xác định nhu cầu vốn

     212              B.  CBTĐ đánh giá nhu cầu vốn dựa trên BCTC đáp ứng quy định của VCB

                      C.  CBTĐ tính toán doanh thu thực tế của toàn bộ nhóm khách hàng, dư nợ vay các TCTD và thông tin CIC
                          để đánh giá rủi ro của cả nhóm khách hàng và xác định chính xác nhu cầu vốn.

                      D.  Khách hàng có hoạt động mua bán như vậy là không minh bạch nên CBTĐ đề xuất không xem xét cấp
                          tín dụng

             02.158 - Biên độ ưu đãi lãi suất áp dụng đối với tài khoản đầu tư linh hoạt trong trường hợp khách hàng SME
             duy trì số dư cuối ngày từ 10 tỷ VND trở lên là?

                      A.  0.1%/năm
     213
                      B.  0.2%/năm

                      C.  0.3%/năm

                      D.  0.4%/năm

             13.016 - Trường hợp KH SME đến thời hạn hiểm tra sử dụng vốn vay, CBTĐ kiểm tra CIC của công ty thì dư
             nợ đủ tiêu chuẩn, khách hàng không có lịch sử nợ nhóm 2 hay nợ xấu. Tuy nhiên, trong thời gian gần đây,
             khách hàng thường xuyên trả nợ gốc lãi chậm từ 1-2 ngày tại VCB. CBTĐ nên xử lý như thế nào trong
            trường hợp này?

                      A.  Không cần phải xử lý gì vì công ty vẫn có lịch sử CIC tốt
     214
                      B.  Yêu cầu khách hàng trả nợ trước hạn vì có dấu hiệu rủi ro chuyển nợ xấu

                      C.  Làm việc cụ thể với khách hàng để tìm hiểu lý do KH thường xuyên chậm trả nợ gốc lãi để có phương
                          án xử lý phù hợp; tăng cường công tác kiểm soát trước, trong và sau cho vay đối với khách hàng trong
                          thời gian tiếp theo.

                      D.  Không có đáp án nào đúng

             02.234 - Để được miễn phí thường niên năm tiếp theo, chủ thẻ tín dụng Vietcombank Vibe cần đạt doanh số
             chi tiêu là bao nhiêu trong vòng 12 kỳ sao kê liền trước kỳ thu phí thường niên?

                      A.  80.000.000 VND
     215
                      B.  70.000.000 VND

                      C.  60.000.000 VND

                      D.  50.000.000 VND

             13.002 - Hộ kinh doanh B được cơ quan có thẩm quyền cấp phép hoạt động kinh doanh mặt hàng vàng
             miếng, vàng, bạc, đá quý đã qua chế tác. Hỏi với ngành nghề kinh doanh trên, cán bộ thẩm định đánh giá
             nhu cầu vốn như thế nào để cấp tín dụng?

                      A.  Không cho vay loại hình Hộ kinh doanh này do không quản lý được việc sử dụng vốn vay của khách
                          hàng có dùng để mua vàng miếng hay không

     216              B.  Có cho vay và đánh giá nhu cầu vốn vay dựa trên doanh thu của hộ kinh doanh không bao gồm mảng
                          kinh doanh vàng miếng

                      C.  Không cho vay do khách hàng có mảng kinh doanh vàng miếng là mặt hàng bị cấm cho vay theo quy
                          định của Pháp luật

                      D.  Có cho vay như các khách hàng thông thường và đánh giá nhu cầu vốn dựa trên doanh thu và vòng
                          quay vốn của công ty

     217     02.159 - Khách hàng có được chi trả trước hạn tài khoản tiền gửi cho con không?

                      A.  Khách hàng được chi trả trước hạn tài khoản tiền gửi cho con. Lãi suất thanh toán trước hạn áp dụng:
                          0.0%/năm

                      B.  Khách hàng được chi trả trước hạn tài khoản tiền gửi cho con. Lãi suất thanh toán trước hạn áp dụng:
                          0.1%/năm

                      C.  Khách hàng được chi trả trước hạn tài khoản tiền gửi cho con. Lãi suất thanh toán trước hạn áp dụng
                          bằng trần lãi suất rút trước hạn VND quy định tại Quyết định về Lãi suất khung của VCB áp dụng đối với
                          khách hàng cá nhân tại thời điểm khách hàng rút trước hạn tiền gửi.

                      D.  Khách hàng không được chi trả trước hạn tài khoản tiền gửi cho con.

             13.017 - Khách hàng SME mới đề xuất vay bổ sung vốn lưu động ngắn hạn phục vụ hoạt động sản xuất kinh
            doanh, CBTĐ nhận thấy hệ thống máy móc, dây chuyển đã quá cũ và hết khấu hao theo quy định nhưng theo
            thực tế kiểm tra và theo số liệu doanh thu cho thấy máy móc vẫn đang hoạt động bình thường và duy trì sản
             lượng hàng năm. CBTĐ sẽ xử lý như thế nào?

                      A.  Không cần lưu ý gì vì không ảnh hưởng tới kết quả sản xuất kinh doanh của doanh nghiệp

     218              B.  Cần đánh giá khả năng năng lực sản xuất của dây chuyền máy móc thiết bị trong thời gian tới, năng lực
                          tài chính của khách hàng trong trường hợp cần đầu tư sửa chữa, nâng cấp, mua sắm mới đối với hệ
                          thống máy móc

                      C.  Đánh giá tổng thể hoạt động sản xuất kinh doanh của doanh nghiệp để xác định hạn mức cho vay trên
                          cơ sở đáp ứng quy định của VCB, đề xuất biện pháp kiểm soát và theo dõi sát sao, thường xuyên hơn
                          đối với hoạt động của hệ thống dây chuyền máy móc thiết bị.

                      D.  Cả B&C đều đúng

            02.160 - Sản phẩm Tiền gửi tích lũy trực tuyến huy động kỳ hạn nào?

                      A.  12 tháng, 24 tháng

     219              B.  3 tháng, 6 tháng, 9 tháng, 12 tháng, 24 tháng

                      C.  6 tháng, 12 tháng, 24 tháng

                      D.  6 tháng, 9 tháng, 12 tháng, 24 tháng

             13.018 - Khách hàng SME có số dư hàng tồn kho trên BCTC khá cao, tuy nhiên, thực tế kiểm tra kho hàng, số
             lượng hàng tồn kho thực tế thấp hơn và đánh giá về quy mô kho hàng không thể đáp ứng lượng hàng tồn
             kho như trên BCTC, cán bộ sẽ ứng xử như thế nào?

                      A.  Cán bộ từ chối cho vay vì nghi ngờ khách hàng đang làm giả số liệu trên BCTC

     220              B.  Cán bộ yêu cầu KH giải trình lý do sai lệch giữa BCTC và thực tế. (Vdu: Có thể do hàng đang đi đường
                          hoặc gửi bán tại các đại lý….). Nếu có giải trình phù hợp thì có thể xem xét cấp tín dụng.

                      C.  Cán bộ cho vay dựa trên số liệu của BCTC do đây là BCTC đã nộp cho cơ quan thuế, đảm bảo tính
                          pháp lý của hồ sơ cho vay.

                      D.  Cán bộ cho vay dựa trên số liệu thực tế tại kho hàng của khách hàng

            02.161 - Loại tài khoản áp dụng theo quy định sản phẩm Tiền gửi trả lãi trước?

                      A.  Tài khoản tiền gửi tiết kiệm

     221              B.  Tài khoản tiền gửi có kỳ hạn

                      C.  Tài khoản tiền gửi tiết kiệm hoặc Tài khoản tiền gửi có kỳ hạn

                      D.  Tài khoản tiền gửi có kỳ hạn bằng GBP

             13.001 - Khách hàng A hiện đang mở một phòng khám nha khoa và đang có nhu cầu vay vốn tại VCB để bổ
            sung vốn kinh doanh. Với vai trò là cán bộ thẩm định, bạn cần thu thập những giấy tờ nào liên quan việc cấp
             phép hoạt động kinh doanh của khách hàng?

                      A.  Giấy chứng nhận đăng ký hộ kinh doanh do cơ quan có thẩm quyền cấp
     222
                      B.  Giấy phép hoạt động khám bệnh, chữa bệnh

                      C.  Chứng chỉ hành nghề khám bệnh, chữa bệnh

                      D.  Cả 3 đáp án trên

            02.163 - Loại tiền huy động sản phẩm Tiết kiệm lĩnh lãi định kỳ gồm?

                      A.  VND, USD, EUR

     223              B.  VND,USD

                      C.  VND

                      D.  VND và các loại ngoại tệ khác VCB huy động tùy thời kỳ


             13.019 - Công ty A là doanh nghiệp có tính chất tư nhân- gia đình, phát sinh nhu cầu vay vốn VCB với hạn
             mức tín dụng là 15 tỷ đồng và dùng TSĐB của ông B để đảm bảo cho khoản vay. Theo hồ sơ khách hàng
            cung cấp, ông B đang là Phó Giám đốc kinh doanh, ông B không có vốn góp trong Công ty A. Tài sản đảm
             bảo là đất và nhà ở tại mặt phố kinh doanh sầm uất có giá trị thị trường khoảng 40 tỷ đồng. Với hình huống
            trên CBTĐ có đồng ý nhận TSBĐ nói trên hay không?

                      A.  Tìm hiểu liệu ông B đang có dấu hiệu vay ké/ vay hộ với công ty A hay không? Nếu không có dấu hiệu
                          vay ké/ vay hộ thì chỉ cần nhận thế chấp TSĐB nêu trên
     224
                      B.  Tìm hiểu liệu ông B đang có dấu hiệu vay ké/ vay hộ với công ty A hay không? Nếu không có dấu hiệu
                          vay ké/ vay hộ thì đồng ý nhận thế chấp tài sản nói trên đồng thời yêu cầu công ty A thế chấp thêm tài
                          sản của chính chủ doanh nghiệp

                      C.  Đồng ý nhận thế chấp tài sản nêu trên vì TSĐB có tính thanh khoản tốt, giá trị lớn so với khoản vay của
                          công ty A

                      D.  Không đồng ý nhận thế chấp TSĐB nêu trên do ông B không có vốn góp trong công ty A

            02.232 - Trong kỳ sao kê tháng 8/2024 (kỳ SK), thẻ Vietcombank Visa Infinite của khách hàng A phát sinh các
            giao dịch như dưới đây. - Tổng doanh số chi tiêu trong kỳ SK: 103.000.000 VND - Trong đó:   01 giao dịch tại
             khách sạn Marriot Thượng Hải, Trung Quốc: 5.600 CNY (đồng nhân dân tệ), tương đương 20.000.000 VND.
            01 giao dịch cà thẻ trực tiếp (POS) tại cửa hàng Gucci, Pháp: 2.000 EUR (đồng Euro), tương đương
            55.000.000 VND.   01 giao dịch ecom tại cửa hàng Hermes, Pháp: 900 EUR (đồng Euro), tương đương
            25.000.000 VND.    01 giao dịch tại cửa hàng Winmart, Hà Nội: 3.000.000 VND. Công thức nào sau đây là đúng
     225    để xác định số tiền hoàn theo tính năng thẻ của khách hàng A?

                      A.  (20.000.000 * 2%) + (55.000.000 * 0.5%) + (25.000.000 * 2%) + (3.000.000 * 0.5%)

                      B.  (20.000.000 * 2%) + (55.000.000 * 0.5%) + (25.000.000 * 0.5%) + (3.000.000 * 0.5%)

                      C.  (20.000.000 * 2%) + (55.000.000 * 2%) + (25.000.000 * 2%) + (3.000.000 * 0.5%)

                      D.  (20.000.000 + 55.000.000 + 25.000.000 + 3.000.000) * 0.5%

             13.020 - Công ty A có trụ sở tại Hà Nội là doanh nghiệp có tính chất tư nhân- gia đình với doanh thu năm
            2023 đạt 95 tỷ đồng, công ty kinh doanh trong lĩnh vực: thương mại hàng nông sản. Công ty A đề xuất vay
            vốn tại VCB số tiền 15 tỷ đồng với TSĐB của chính chủ sở hữu công ty là 01 lô đất mới sang tên chuyển
             nhượng trước khi đề xuất vay VCB, với giá trị định giá là 15 tỷ đồng. Với tình huống trên, nếu khách hàng có
             phương án kinh doanh khả thi, hiệu quả, có đủ khả năng trả nợ, CBTĐ cần lưu ý thêm vấn đề gì khi thẩm
            định nhu cầu vốn của khách hàng?

                      A.  Kiểm tra tính hợp lý của nguồn tiền hình thành lên TSĐB, để đánh giá tài sản mới mua có dấu hiệu rủi ro
                          liên quan đến vay ké không?nếu không, có việc sử dụng vốn của công ty để mua tài sản cho cá nhân
     226                  hay không, có ảnh hưởng gì đến vốn lưu động ròng của công ty không để có sự đánh giá tổng thể về rủi
                          ro trước khi đề xuất cấp tín dụng cho khách hàng.

                      B.  Khách hàng đáp ứng đầy đủ các quy định cho vay của VCB nên đủ điều kiện cấp tín dụng theo đề nghị
                          của khách hàng.

                      C.  Nếu khách hàng đáp ứng các quy định cho vay của VCB, đồng ý đề xuất cấp tín dụng cho khách hàng
                          với điều kiện khách hàng dùng TSBĐ khác do lo ngại tính pháp lý của tài sản mới nhận chuyển nhượng.

                      D.  Không đồng ý cấp tín dụng cho khách hàng

            02.170 - Quyền lợi bảo hiểm của sản phẩm FWD Vững ước mơ là?

                      A.  Tỷ lệ tham gia bảo hiểm * Dư nợ gốc thực tế

     227              B.  Tỷ lệ tham gia bảo hiểm * (Dư nợ gốc ban đầu + lãi phát sinh )

                      C.  Tỷ lệ tham gia bảo hiểm * (Dư nợ gốc thực tế + lãi phát sinh trong hạn)

                      D.  Tỷ lệ tham gia bảo hiểm * (Hạn mức tín dụng + lãi phát sinh trong hạn)

            01.037 - Theo CV 11290/VCB-CSKHBL ngày 28/06/2024 v/v Quy định Ủy quyền đối với KHBL theo các Gói
            SPDV: Trường hợp CN muốn áp dụng chính sách ưu đãi phí cho KHBL ngoài thẩm quyền quy định tại
            CV11290 và/hoặc các văn bản của VCB quy định về phí dịch vụ đối với KHBL , CN trình BLĐ xem xét, phê
            duyệt thông qua phòng nào?

     228              A.  Phòng chính sách khách hàng bán lẻ

                      B.  Phòng quản lý kênh chi nhánh

                      C.  Phòng phát triển sản phẩm bán lẻ

                      D.  Cả A,B

            02.171 - Tổng Quyền lợi bảo hiểm nhận được trong trường hợp Người được bảo hiểm (bố/mẹ) tử vong do tai
             nạn của sản phẩm FWD Con vươn xa 2.0 bao gồm:

                      A.  510% Số tiền bảo hiểm + Lãi tích lũy
     229
                      B.  410% Số tiền bảo hiểm + Lãi tích lũy

                      C.  310% Số tiền bảo hiểm + Lãi tích lũy

                      D.  210% Số tiền bảo hiểm + Lãi tích lũy

            01.034 - Theo CV 11290/VCB-CSKHBL ngày 28/06/2024 v/v Quy định Ủy quyền đối với KHBL theo các Gói
            SPDV: GĐ CN được UQ miễn phí thường niên thẻ TDQT đối với CBNV của KHTC khi CBNV đáp ứng điều
             kiện:

                      A.  Nhận lương từ KHTC qua TK tại VCB
     230
                      B.  Sử dụng Digibank

                      C.  Cả A và B

                      D.  A hoặc B

            02.172 - Số tiền bảo hiểm của Sản phẩm FWD Bộ 3 bảo vệ bao gồm các gói sau:

                      A.  200 triệu đồng; 300 triệu đồng

     231              B.  300 triệu đồng; 500 triệu đồng

                      C.  200 triệu đồng; 300 triệu đồng; 500 triệu đồng

                      D.  200 triệu đồng; 400 triệu đồng; 600 triệu đồng

            01.039 - Theo CV 11290/VCB-CSKHBL ngày 28/06/2024 v/v Quy định Ủy quyền đối với KHBL theo các Gói
            SPDV: GĐ CN được UQ giảm lãi suất cho vay tiêu dùng tối đa bao nhiêu %/năm đối với CB là lãnh đạo KHBB
             lớn.

                      A.  0.2%
     232
                      B.  0.3%

                      C.  0.5%

                      D.  0.7%

            02.230 - Các loại thẻ nào sau đây được áp dụng chính sách miễn phí thường niên năm đầu đối với 01 thẻ phụ
            theo quy định của Vietcombank?

                      A.  Tất cả các thẻ tín dụng cá nhân hạng Infinite, Signature, Platinum, World, Vàng, Chuẩn.
     233
                      B.  Các thẻ tín dụng cá nhân cao cấp hạng Infinite, Signature, Platinum, World.

                      C.  Các thẻ tín dụng cá nhân hạng Platinum, World, Vàng, Chuẩn.

                      D.  Các thẻ tín dụng cá nhân hạng Vàng, Chuẩn.

            01.040 - Theo CV 11290/VCB-CSKHBL ngày 28/06/2024 v/v Quy định Ủy quyền đối với KHBL theo các Gói
            SPDV: GĐ CN được UQ miễn phí thẻ tín dụng quốc tế bao nhiêu thẻ đối với Cấp lãnh đạo khi CB đáp ứng
            điều kiện của Gói SPDV

                      A.  Miễn phí thường niên 1 năm đối với tối đa 2 thẻ TDQT hạng Gold
     234
                      B.  Miễn phí thường niên 1 năm đối với 1 thẻ TDQT hạng bất kỳ

                      C.  Miễn phí thường niên 2 năm đối với tối đa 2 thẻ TDQT hạng Platinum

                      D.  Miễn phí thường niên 2 năm đối với 1 thẻ TDQT hạng bất kỳ

            02.173 - Phạm vi bảo vệ cơ bản của sản phẩm FWD Phụ nữ hiện đại bao gồm:

                      A.  Ung thư giai đoạn sau phổ biến ở phụ nữ, Phẫu thuật u nang buồng trứng, Biến chứng thai sản phổ biến

     235              B.  Ung thư giai đoạn sau phổ biến ở phụ nữ, Điều trị trầm cảm, Phẫu thuật tái tạo chỉnh hình và ghép da

                      C.  Phẫu thuật u xơ tử cung, Phẫu thuật u nang buồng trứng, Biến chứng thai sản phổ biến

                      D.  Ung thư giai đoạn sau phổ biến ở phụ nữ, Điều trị trầm cảm, Phẫu thuật u xơ tử cung


            01.033 - Theo CV 11290/VCB-CSKHBL ngày 28/06/2024 v/v Quy định Ủy quyền đối với KHBL theo các Gói
            SPDV: Bộ SPDV khuyến nghị chào bán đến các KHCN là CBNV của các KHTC (bao gồm KHBB và KHTCBL)
            là?

                     A.   - Tài khoản thanh toán - Ngân hàng số VCB DigiBank
     236
                      B.  - Sản phẩm thẻ GNNĐ, GNQT và TDQT - Sản phẩm tiền gửi trực tuyến, tiền gửi tích lũy

                     C.   - Sản phẩm/mục đích cho vay tiêu dùng (bao gồm cả thấu chi) - Sản phẩm BHNT

                      D.  Cả A,B,C

            02.174 - Trong Sản phẩm FWD Đón đầu thay đổi 3.0, FWD chi trả Quyền lợi Ung thư giai đoạn sau bằng:

                     A.   10 lần Phí bảo hiểm cơ bản của 1 Năm hợp đồng nhưng không vượt quá 30% Số tiền bảo hiểm

     237              B.  10 lần Phí bảo hiểm cơ bản của 1 Năm hợp đồng nhưng không vượt quá 50% Số tiền bảo hiểm

                     C.   5 lần Phí bảo hiểm cơ bản của 1 Năm hợp đồng nhưng không vượt quá 30% Số tiền bảo hiểm

                      D.  5 lần Phí bảo hiểm cơ bản của 1 Năm hợp đồng nhưng không vượt quá 50% Số tiền bảo hiểm

            01.043 - Đặc điểm nhận diện phổ biến của nhóm KH gia đình

                     A.   - Độ tuổi: từ 35 – 50; - Đã có gia đình – mới kết hôn hoặc kết hôn nhiều năm; - Đã/đang có con hoặc
                          đang có kế hoạch sinh con trong tương lai gần;

                      B.  - Độ tuổi: từ 35 – 60; - Đã có gia đình – mới kết hôn hoặc kết hôn nhiều năm; - Đã/đang có con hoặc
     238                  đang có kế hoạch sinh con trong tương lai gần;

                     C.   - Độ tuổi: từ 20 – 35; - Đã có gia đình – mới kết hôn hoặc kết hôn nhiều năm; - Đã/đang có con hoặc
                          đang có kế hoạch sinh con trong tương lai gần;

                      D.  - Độ tuổi: từ 50 – 65; - Đã có gia đình – mới kết hôn hoặc kết hôn nhiều năm; - Đã/đang có con hoặc
                          đang có kế hoạch sinh con trong tương lai gần;

            02.175 - Chị A tham gia sản phẩm FWD Nâng tầm vị thế 2.0 với Số tiền bảo hiểm tại thời điểm tham gia là 2 tỷ
            đồng. Trường hợp chị A tử vong do tai nạn trong Năm hợp đồng thứ 5, FWD sẽ chi trả quyền lợi bảo hiểm
            bằng

                     A.   2 tỷ đồng + Toàn bộ Giá trị quỹ hợp đồng
     239
                      B.  2,3 tỷ đồng + Toàn bộ Giá trị quỹ hợp đồng

                     C.   4 tỷ đồng + Toàn bộ Giá trị quỹ hợp đồng

                      D.  4,6 tỷ đồng + Toàn bộ Giá trị quỹ hợp đồng

            01.044 - Những SPDV được thiết kế dành riêng cho KH gia đình gồm?

                     A.   Tiền gửi cho con; Thẻ ghi nợ cho con

     240              B.  Cho vay thanh toán học phí

                     C.   Tính năng trả nợ vay từ 2 tài khoản

                      D.  Tất cả các đáp án trên

            02.228 - Danh sách nào sau đây là đúng nhất về lĩnh vực chi tiêu được hoàn tiền cao nhất của mỗi loại thẻ?

                     A.   1. Thẻ TDQT Vietcombank Visa Platinum - Không phân biệt lĩnh vực 2. Thẻ TDQT Vietcombank
                          Mastercard World - Ăn uống và Du lịch tại nước ngoài 3. Thẻ TDQT Vietcombank American Express
                          Cashplus Platinum - Chi tiêu nước ngoài 4. Thẻ TDQT Vietcombank JCB Platinum - Nhà hàng, Siêu thị

                      B.  1. Thẻ TDQT Vietcombank Visa Platinum - Y tế, Giáo dục 2. Thẻ TDQT Vietcombank Mastercard World -
                          Ăn uống và Du lịch tại nước ngoài 3. Thẻ TDQT Vietcombank American Express Cashplus Platinum -
     241                  Chi tiêu nước ngoài 4. Thẻ TDQT Vietcombank JCB Platinum - Nhà hàng, Siêu thị

                     C.   1. Thẻ TDQT Vietcombank Visa Platinum - Không phân biệt lĩnh vực 2. Thẻ TDQT Vietcombank
                          Mastercard World - Ăn uống và Du lịch 3. Thẻ TDQT Vietcombank American Express Cashplus Platinum
                          - Chi tiêu nước ngoài 4. Thẻ TDQT Vietcombank JCB Platinum - Nhà hàng, Siêu thị tại nước ngoài

                      D.  1. Thẻ TDQT Vietcombank Visa Platinum - Du lịch, Lưu trú, Bảo hiểm 2. Thẻ TDQT Vietcombank
                          Mastercard World - Ăn uống và Du lịch tại nước ngoài 3. Thẻ TDQT Vietcombank American Express
                          Cashplus Platinum - Chi tiêu nước ngoài 4. Thẻ TDQT Vietcombank JCB Platinum - Nhà hàng, Siêu thị

     242    01.045 - Tính năng nào trên VCB Digibank giúp KH tìm hiểu và đăng ký sử dụng sản phẩm dịch vụ dành cho

            KH Gia đình?

                     A.  Tiền gửi cho con

                      B. Thẻ ghi nợ cho con

                     C.  VCB Family (tại mục Tiện ích)

                     D.  Tất cả các đáp án trên

            02.180 - Vietcombank đang hợp tác để giới thiệu mở tài khoản giao dịch chứng khoán cho các đối tác nào?

                     A.  VCBF

     243              B. VCBS

                     C.  SSI

                     D.  TCBS

            01.032 - Tại tính năng Biến động thu - chi trong Quản lý tài chính cá nhân trên Digibank, KH có thể:

                     A.  Theo dõi tổng thu và tổng chi trong 9 tháng gần nhất

     244              B. Theo dõi tổng thu và tổng chi trong 12 tháng gần nhất

                     C.  Theo dõi tổng thu và tổng chi trong 3 tháng gần nhất

                     D.  Theo dõi tổng thu và tổng chi trong 6 tháng gần nhất

            02.182 - Khách hàng có thể đặt lệnh mua chứng chỉ quỹ của VCBF trên kênh Digibank với giá trị tối thiểu bao
            nhiêu?

                     A.   100.000.000 VNĐ
     245
                      B.  10.000.000 VNĐ

                     C.   100.000 VNĐ

                     D.   10.000 VNĐ

            01.046 - Hiện tại VCB đang phân phối sản phẩm Bảo hiểm nhân thọ nào phù hợp với phân khúc khách hàng
            gia đình, bảo vệ được cả bố/mẹ và các con?

                     A.   FWD Cả nhà vui khỏe
     246
                      B.  FWD Con vươn xa 2.0

                     C.   FWD Bộ 3 bảo vệ

                     D.  A&B

            02.183 - Khách hàng nào có thể mở tài khoản giao dịch chứng khoán qua kênh VCB Digibank?

                     A.   KHCN trong nước

     247              B.  KHCN nước ngoài

                     C.   KHCN và SME bán lẻ

                     D.  Cả A&B

            01.048 - Theo CV 4995/VCB-CSSPBB.CSKHBL.PTSP&GSGDV ngày 29/03/2024 v/v Quy định định danh khách
            hàng trong hệ thống VCB, Khách hàng nào sau đây là KH SME

                     A.   Doanh nghiệp có doanh thu thuần năm gần nhất đạt 170 tỷ VND
     248
                      B.  Doanh thu thuần trên BCTC trong 02 năm liên tiếp gần nhất đạt lần lượt 80 tỷ VND và 90 tỷ VND

                     C.   Doanh thu thuần trên BCTC trong 02 năm liên tiếp gần nhất đạt lần lượt 90 tỷ VND và 100 tỷ VND

                     D.  Cả B và C

            02.184 - VCBF hiện chưa triển khai loại sản phẩm, dịch vụ nào nào?

                     A.  Quỹ mở

     249              B.  Dịch vụ ủy thác đầu tư

                     C.  Quỹ hưu trí

                     D.  Quỹ hoán đổi danh mục ETF


            01.030 - Tại tính năng Quản lý chi trong Quản lý tài chính cá nhân trên Digibank, KH có thể:

                     A.   Theo dõi chi tiết toàn bộ giao dịch chi tiêu theo từng mục đích chi tiêu trong 12 tháng gần nhất

     250              B.  Theo dõi chi tiết toàn bộ giao dịch chi tiêu theo từng mục đích chi tiêu trong 9 tháng gần nhất

                     C.   Theo dõi chi tiết toàn bộ giao dịch chi tiêu theo từng mục đích chi tiêu trong 6 tháng gần nhất

                      D.  Theo dõi chi tiết toàn bộ giao dịch chi tiêu theo từng mục đích chi tiêu trong 3 tháng gần nhất

            02.227 - Vietcombank đã triển khai tính năng đăng ký phát hành thẻ doanh nghiệp trên kênh điện tử (VCB
            Digibiz) cho các sản phẩm thẻ nào sau đây?

                     A.   Thẻ tín dụng Vietcombank Visa Platinum Business
     251
                      B.  Thẻ ghi nợ Vietcombank Visa Business

                     C.   Thẻ tín dụng Visa Corporate

                      D.  Thẻ tín dụng Vietcombank Visa Platinum Business Thẻ ghi nợ Vietcombank Visa Business

            02.186 - Dịch vụ nhận tiền kiều hối của VCB hợp tác với các công ty chuyển tiền quốc tế bao gồm những
            dịch vụ nào?

                     A.   Dịch vụ nhận tiền VCBR, TNMonex,
     252
                      B.  Dịch vụ nhận tiền MoneyGram, RIA

                     C.   Dịch vụ nhận tiền UniTeller, Xoom

                      D.  Tất cả các dịch vụ trên

            01.051 - Theo CV 4995/VCB-CSSPBB.CSKHBL.PTSP&GSGDV ngày 29/03/2024 v/v Quy định định danh khách
            hàng trong hệ thống VCB, Khách hàng nào sau đây là KHTCBL

                     A.   Ban bảo vệ chính trị nội bộ
     253
                      B.  Ban Cán sự Đảng ngoài nước

                     C.   Ban Dân vận

                      D.  Không đáp án nào đúng

            02.187 - Dịch vụ chuyển tiền đi MoneyGram có thể thực hiện tại địa điểm nào sau đây?

                     A.   Tất cả các chi nhánh và phòng giao dịch VCB.

     254              B.  Chỉ có thể thực hiện tại trụ sở chi nhánh VCB.

                     C.   Chỉ thực hiện được tại một số điểm giao dịch VCB.

                      D.  Không có câu trả lời đúng.

            01.053 - Theo CV 16678/VCB.CSSPBB.CSKHBL ngày 28/11/2023 v/v Điều chỉnh QĐ chuyển định danh khách
            hàng, tần suất chuyển định danh định kỳ là bao lâu?

                     A.   01 lần/ năm
     255
                      B.  02 lần/ năm

                     C.   01 lần/quý

                      D.  01 lần/ tháng

            02.188 - Đối với các dịch vụ nhận tiền kiều hối hợp tác với các công ty chuyển tiền quốc tế, thông tin nào
            người nhận cần cung cấp cho chi nhánh/PGD Vietcombank để nhận tiền?

                     A.   Giấy tờ tùy thân của người nhận.
     256
                      B.  Mã số nhận tiền.

                     C.   Giấy tờ tùy thân của người nhận và mã số nhận tiền.

                      D.  Hình ảnh chụp biên lai xác nhận giao dịch chuyển tiền đến từ nước ngoài.

     257    01.054 - Theo CV 16678/VCB.CSSPBB.CSKHBL ngày 28/11/2023 v/v Điều chỉnh QĐ chuyển định danh khách
            hàng, thẩm quyền phê duyệt chuyển định danh đột xuất trong trường hợp lãnh đạo đơn vị TSC đồng thuận
            v/v chuyển đổi dịnh danh là:

                     A.   Lãnh đạo đơn vị TSC quản lý phân khúc khách hàng bên nhận và bên chuyển

                      B.  Ban lãnh đạo phụ trách khối bán buôn và khối bán lẻ

                     C.   Tổng giám đốc

                      D.  Không đáp án nào đúng

            02.225 - Đáp án nào sau đây mô tả đúng tính năng hoàn tiền của thẻ tín dụng quốc tế Vietcombank
            Mastercard World?

                     A.   - Hoàn tiền lên đến 800.000 VND/kỳ sao kê - Hoàn 5% giá trị giao dịch chi tiêu ăn uống và du lịch tại
                          nước ngoài - Hoàn 0,5% cho các giao dịch còn lại

     258              B.  - Hoàn tiền lên đến 800.000 VND/kỳ sao kê - Hoàn 5% giá trị giao dịch chi tiêu ăn uống và du lịch tại
                          nước ngoài - Hoàn 1% cho các giao dịch còn lại

                     C.   - Hoàn tiền lên đến 1.000.000 VND/kỳ sao kê - Hoàn 5% giá trị giao dịch chi tiêu ăn uống và du lịch tại
                          nước ngoài - Hoàn 2% cho các giao dịch còn lại

                      D.  - Hoàn tiền lên đến 1.000.000 VND/kỳ sao kê - Hoàn 5% giá trị giao dịch chi tiêu ăn uống và du lịch tại
                          nước ngoài - Hoàn 0.5% cho các giao dịch còn lại

            01.029 - Tại tính năng Thiết lập ngân sách trong Quản lý tài chính cá nhân trên Digibank, KH có thể:

                     A.   Phân bổ ngân sách chi tiêu cho từng hạng mục

     259              B.  Cài đặt ngưỡng cảnh báo chi tiêu

                     C.   A&B

                      D.  Không đáp án nào đúng

            02.189 - Dịch vụ chi trả kiều hối VCBR và TNMonex bao gồm những hình thức chi trả nào?

                     A.   Chi trả tại Quầy VCB

     260              B.  Chi trả qua tài khoản VCB và tài khoản ngân hàng khác

                     C.   Chi trả qua tài khoản VCB

                      D.  Chi trả tại Quầy VCB, chi qua tài khoản VCB và chi qua tài khoản Ngân hàng khác

            01.055 - Theo CV 16678/VCB.CSSPBB.CSKHBL ngày 28/11/2023 v/v Điều chỉnh QĐ chuyển định danh khách
            hàng, đơn vị tác nghiệp thực hiện chuyển sổ đột xuất là:

                     A.   Đơn vị TSC quản lý phân khúc khách hàng bên nhận
     261
                      B.  Đơn vị TSC quản lý phân khúc khách hàng bên chuyển

                     C.   Trung tâm dịch vụ khách hàng

                      D.  Chi nhánh

            02.190 - Khách hàng có thể thực hiện tra cứu thông tin tài khoản bằng cách nào?

                     A.   Tra cứu tại quầy giao dịch

     262              B.  Trên kênh ngân hàng điện tử

                     C.   Gọi điện đến trung tâm hỗ trợ khách hàng của VCB (VCC)

                      D.  Tất cả các phương án đều đúng

            01.056 - Theo CV 8411/VCB-CSKHBL-PTSPBL ngày 20/12/2022 v/v QĐ định danh phân khúc/phân nhóm KH
            SME, đâu là tiêu chí chính xác để định danh SME vừa?

                     A.   KH tổ chức BL có doanh thu thuần năm gần nhất > 20 tỷ VND
     263
                      B.  KH tổ chức BL có doanh thu thuần năm gần nhất ≥ 20 tỷ VND

                     C.   KH tổ chức BL có doanh thu thuần năm gần nhất > 50 tỷ VND

                      D.  KH tổ chức BL có doanh thu thuần năm gần nhất ≥ 50 tỷ VND

     264    02.191 - Hiện nay, VCB đang cung cấp các kênh mở tài khoản thanh toán nào cho khách hàng cá nhân?

                     A.   Tại quầy giao dịch VCB

                      B.  Ngân hàng số VCB Digibank dành cho khách hàng cá nhân

                      C.  Kênh đối tác (Ví dụ: Ví điện tử)

                      D.  Tất cả các phương án đều đúng

            01.028 - Tại tính năng Quản lý tài chính cá nhân trên Digibank, KH có thể thiết lập ngân sách chi tiêu và quản
             lý ngân sách chi tiêu theo những hạng mục nào?

                      A.  6 hạng mục gồm (i) Chi tiêu thiết yếu, (ii) Mua sắm giải trí, (iii) Giáo dục/Y tế/Bảo hiểm, (iv) Tiết kiệm, (v)
                          Đầu tư, (vi) Chi khác
     265
                      B.  5 hạng mục gồm (i) Chi tiêu thiết yếu, (ii) Mua sắm giải trí, (iii) Giáo dục/Y tế/Bảo hiểm, (iv) Tiết kiệm, (v)
                          Chi khác

                      C.  4 hạng mục gồm (i) Chi tiêu thiết yếu, (ii) Mua sắm giải trí, (iii) Giáo dục/Y tế/Bảo hiểm, (iv) Tiết kiệm

                      D.  3 hạng mục gồm (i) Chi tiêu thiết yếu, (ii) Mua sắm giải trí, (iii) Giáo dục/Y tế/Bảo hiểm

            02.195 - Khách hàng mở tài khoản tiền gửi thanh toán tại VCB được yêu cầu xác nhận số dư/in sao kê tài
             khoản tại địa điểm giao dịch nào của VCB?

                      A.  Tại chi nhánh khách hàng mở tài khoản
     266
                      B.  Tại chi nhánh khách hàng mở CIF (địa điểm giao dịch đầu tiên của khách hàng với VCB)

                      C.  Tại bất kỳ điểm giao dịch nào của VCB

                      D.  A&B

            01.058 - Theo CV 8411/VCB-CSKHBL-PTSPBL ngày 20/12/2022 v/v QĐ định danh phân khúc/phân nhóm KH
            SME, trường hợp đặc biệt, GĐCN được quyết định việc định danh KH là SME vừa trong trường hợp nào sau
            đây?

                      A.  KH mới chưa mở CIF tại VCB và VCB có thông tin về doanh thu thuần năm gần nhất của KH
     267
                      B.  KH mới chưa mở CIF tại VCB và VCB không có thông tin về doanh thu thuần năm gần nhất của KH

                      C.  KH hiện hữu đã có CIF tại VCB và VCB có thông tin về doanh thu thuần năm gần nhất của KH

                      D.  Cả A và B

            02.224 - Nếu khách hàng đã có 01 thẻ chính thẻ ghi nợ Vietcombank Mastercard (tài khoản VND) hình thức
             phi vật lý, khách hàng có thể phát hành thêm thẻ chính thẻ ghi nợ Vietcombank Mastercard (tài khoản VND)
            theo hình thức vật lý không?

                      A.  Có. Vietcombank không giới hạn số lượng thẻ ghi nợ vật lý và phi vật lý được phép phát hành của mỗi
                          khách hàng.
     268
                      B.  Có. Mỗi khách hàng được phép có 1 thẻ ghi nợ Vietcombank Mastercard hình thức vật lý và 1 thẻ ghi nợ
                          Vietcombank Mastercard hình thức phi vật lý cùng gắn với 1 tài khoản VND.

                      C.  Không. Vietcombank chưa triển khai thẻ ghi nợ Vietcombank Mastercard hình thức vật lý.

                      D.  Không. Nếu khách hàng có nhu cầu sử dụng thẻ vật lý, khách hàng cần thực hiện thao tác "Đăng ký in
                          thẻ" trên VCB Digibank để chuyển thẻ phi vật lý sang vật lý.

            01.059 - Theo CV 8411/VCB-CSKHBL-PTSPBL ngày 20/12/2022 v/v QĐ định danh phân khúc/phân nhóm KH
            SME, cấp thẩm quyền thay đổi định danh phân khúc/ phân nhóm SME đột xuất là?

                      A.  Lãnh đạo phòng quản lý KH
     269
                      B.  Ban lãnh đạo CN

                      C.  TSC thông qua Phòng Chính sách khách hàng bán lẻ

                      D.  Tổng giám đốc

            02.196 - Khách hàng thực hiện các giao dịch tại VCB được yêu cầu cung cấp bản sao chứng từ giao dịch tại
            địa điểm nào của VCB?

                      A.  Tại địa điểm mà khách hàng đã thực hiện giao dịch
     270
                      B.  Tại bất kỳ điểm giao dịch nào của VCB

                      C.  Tại chi nhánh khách hàng mở CIF (địa điểm giao dịch đầu tiên của khách hàng với VCB)

                      D.  A&C


             01.027 - Tính năng Quản lý tài chính cá nhân trên Digibank được triển khai trên những phiên bản giao diện
             nào?

                      A.  Priority
     271
                      B.  YouPro

                      C.  Mass

                      D.  Cả 3 đáp án trên

             02.198 - Khách hàng thực hiện giao dịch trên kênh ngân hàng điện tử của VCB được yêu cầu cung cấp bản
             giấy chứng từ giao dịch điện tử tại địa điểm nào của VCB?

                      A.  Tại chi nhánh khách hàng mở CIF (địa điểm giao dịch đầu tiên của khách hàng với VCB)
     272
                      B.  Tại bất kỳ điểm giao dịch nào của VCB

                      C.  Tại chi nhánh khách hàng đăng ký sử dụng dịch vụ ngân hàng điện tử của VCB

                      D.  Không có phương án nào đúng

             01.060 - Theo QĐ 296/QĐ-VCB-CSKHBL ngày 22/02/2023 v/v Quy định về mô hình phục vụ KHBL, định mức
             phục vụ KH SME của 1 RM SME là?

                      A.  50-70 KH
     273
                      B.  70-100 KH

                      C.  100-120 KH

                      D.  100-150 KH

             02.204 - Chính sách phí dịch vụ SMSBanking ban hành từ ngày 01/01/2024 được tính và thu phí KHCN theo:

                      A.  Tổng sản lượng tin nhắn sử dụng/tháng

     274              B.  Số điện thoại đăng ký dịch vụ/tháng

                      C.  Sản lượng tin nhắn sử dụng trên số điện thoại đăng ký/tháng

                      D.  Toàn bộ KHCN được miễn phí dịch vụ SMS chủ động trong 3 tháng đầu triển khai

             01.061 - Theo QĐ 296/QĐ-VCB-CSKHBL ngày 22/02/2023 v/v Quy định về mô hình phục vụ KHBL, KH SME
            vừa được phân công phục vụ bởi ai?

                      A.  RM SME

     275              B.  PBO kiêm nhiệm trong trường hợp trụ sở CN hoặc PGD không có đủ RM SME để phân công chuyên
                          trách phục vụ SME vừa

                      C.  RM Priority kiêm nhiệm trong trường hợp trụ sở CN hoặc PGD không có đủ RM SME để phân công
                          chuyên trách phục vụ SME vừa

                      D.  Cả A,B và C

             02.222 - Bạn được Vietcombank cấp 1 thẻ tín dụng Visa hạn mức 50 triệu VNĐ. Bạn liên kết thẻ này với Ví
            Apple (ứng dụng Ví có sẵn trên thiết bị di động của Apple) và Ví Garmin (ứng dụng Ví có sẵn trên đồng hồ
             Garmin) thì tổng hạn mức sử dụng thẻ Visa được cấp nêu trên của bạn thay đổi như thế nào?

                      A.  Giữ nguyên không đổi (50 triệu VNĐ)
     276
                      B.  Tăng lên (75 triệu VNĐ)

                      C.  Tăng lên (100 triệu VNĐ)

                      D.  Tăng lên (150 triệu VNĐ)

     277     01.067 - Theo công văn 8411/VCB-CSKHBL-PTSPBL v/v Quy định định danh phân khúc/ phân nhóm KH SME,
            Tiêu chí định danh KH SME nhỏ/siêu nhỏ tín dụng là:

                      A.  Là KH SME đáp ứng đồng thời các điều kiện: 1. DTT năm gần nhất ≤ 20 tỷ VND 2. Tổng giá trị cấp TD
                          và giá trị bảo lãnh cho bên thứ ba ≤ 5 tỷ VND (không bao gồm KH đã xác định GHTD > 5 tỷ đồng)

                      B.  Là KH SME đáp ứng đồng thời các điều kiện: 1. DTT năm gần nhất > 20 tỷ VND 2. Tổng giá trị cấp TD
                          và giá trị bảo lãnh cho bên thứ ba ≤ 5 tỷ VND (không bao gồm KH đã xác định GHTD > 5 tỷ đồng)

                      C.  Là KH SME đáp ứng đồng thời các điều kiện: 1. DTT năm gần nhất > 20 tỷ VND 2. Tổng giá trị cấp TD
                          và giá trị bảo lãnh cho bên thứ ba >5 tỷ VND 3. Không bao gồm KH thuộc các đối tượng: Cơ quan nhà
                          nước, đơn vị hành chính sự nghiệp, tổ chức chính trị - xã hội; Trường công lập các cấp; Các DN thành
                          lập để triển khai dự án đầu tư.

                      D.  Là KH SME đáp ứng đồng thời các điều kiện: 1. DTT năm gần nhất ≤ 20 tỷ VND 2. Tổng giá trị cấp TD
                          và giá trị bảo lãnh cho bên thứ ba ≤ 5 tỷ VND (không bao gồm KH đã xác định GHTD > 5 tỷ đồng) 3.
                          Không bao gồm KH thuộc các đối tượng: Cơ quan nhà nước, đơn vị hành chính sự nghiệp, tổ chức
                          chính trị - xã hội; Trường công lập các cấp; Các DN thành lập để triển khai dự án đầu tư.

            02.206 - Từ ngày 01/01/2024, KHCN muốn duy trì mức phí SMS chủ động là 11,000 VNĐ/SĐT/tháng (bao gồm
            VAT) chỉ được phát sinh tối đa bao nhiêu tin nhắn biến động số dư trong tháng?

                     A.   10 tin nhắn
     278
                      B.  15 tin nhắn

                     C.   19 tin nhắn

                      D.  20 tin nhắn

            01.022 - Tại tính năng Quản lý nhóm, khi KH lập đề nghị thanh toán cho các thành viên nhóm, để chuyển tiền
            được tới Trưởng nhóm, thành viên nhóm cần:

                     A.   Chỉ cần Đồng ý và Xác nhận giao dịch, hệ thống sẽ tự động hiển thị thông tin người nhận và số tiền cần
                          chuyển
     279
                      B.  Cần nhập lại thông tin người nhận và số tiền cần chuyển

                     C.   Cần nhập lại thông tin người nhận

                      D.  Cần nhập lại số tiền cần chuyển

            02.207 - KHCN có nhu cầu mở tài khoản thanh toán số chọn theo số điện thoại sử dụng VCB Digibank sẽ
            được miễn phí khi thực hiện tại:

                     A.   Kênh Quầy
     280
                      B.  Kênh VCB Digibank

                     C.   A&B

                      D.  Kênh tổng đài 24/7

            01.069 - Đối tượng KH mục tiêu của VCB DigiBiz là gì?

                     A.   Khách hàng tổ chức bán buôn

     281              B.  Khách hàng tổ chức bán lẻ

                     C.   Khách hàng cá nhân

                      D.  Cả A,B,C

            02.211 - Đơn vị nào tại VCB thực hiện hậu kiểm KHCN hiện hữu đăng ký VCB Digibank trực tuyến?

                     A.   Điểm giao dịch do KH lựa chọn tại thời điểm đăng ký VCB Digibank trực tuyến

     282              B.  CN quản lý tài khoản thanh toán hiện hữu

                     C.   CN quản lý CIF KH hiện hữu

                      D.  Trung tâm dịch vụ khách hàng

            01.071 - KH sử dụng mô hình 1 cấp trên VCB DigiBiz có hạn mức giao dịch trên VCB DigiBiz tối đa bao
            nhiêu?

                     A.   30 tỷ VNĐ/1.5 triệu USD
     283
                      B.  50 tỷ VNĐ/2.5 triệu USD

                     C.   75 tỷ VNĐ/3.5 triệu USD

                      D.  100 tỷ VNĐ/4.5 triệu USD

     284    02.212 - Đơn vị nào tại VCB thực hiện hậu kiểm KHCN mở mới tài khoản thanh toán trực tuyến?

                     A.   Trung tâm hỗ trợ khách hàng

                      B.  Trung tâm dịch vụ khách hàng

                     C.   Điểm giao dịch do KH lựa chọn tại thời điểm đăng ký mở mới tài khoản thanh toán trực tuyến

                      D.  Trung tâm quản lý vận hành bán lẻ

            01.021 - KH có thể tạo bao nhiêu nhóm trong tính năng Quản lý nhóm trên Digibank?

                     A.   Không giới hạn

     285              B.  Tối đa 5 nhóm

                     C.   Tối đa 10 nhóm

                      D.  Tối đa 20 nhóm

            02.221 - KHCN thực hiện chuyển tiền đi nước ngoài trên VCB Digibank được áp dụng tỷ giá ưu đãi dựa theo
            các tiêu chí nào?

                     A.   Phân hạng khách hàng VIP của VCB
     286
                      B.  Theo giá trị giao dịch mua bán ngoại tệ (quy VND)

                     C.   Theo loại ngoại tệ mà KH mua với VCB

                      D.  Theo loại tiền ngoại tệ và giá trị ngoại tệ KH thực hiện mua (quy VND)

            01.072 - KH chuyển khoản giữa các tài khoản cùng 1 chủ tài khoản trên VCB DigiBiz chịu mức phí bao
            nhiêu?

                     A.   Miễn phí
     287
                      B.  7000 VNĐ/món

                     C.   0.7 USD/món

                      D.  0.02% tối thiểu 20.000 VNĐ

            02.215 - KHCN có thể chuyển tiền đi nước ngoài trên kênh VCB Digibank với các mục đích chuyển tiền nào?

                     A.   Tất cả các mục đích chuyển tiền hợp pháp theo quy định ngoại hối của pháp luật và VCB.

     288              B.  Học tập nước ngoài; Chữa bệnh nước ngoài; Công tác, du lịch thăm viếng nước ngoài.

                     C.   Học tập nước ngoài; Chữa bệnh nước ngoài; Công tác, du lịch thăm viếng nước ngoài; Trợ cấp thân
                          nhân; Trả phí dịch vụ.

                      D.  Học tập nước ngoài; Chữa bệnh nước ngoài; Trợ cấp thân nhân.

            01.073 - Các loại mã truy cập trên VCB DigiBiz?

                     A.   Mã quản trị

     289              B.  Mã lập lệnh

                     C.   Mã duyệt lệnh

                      D.  Cả A,B,C

            02.217 - VCB sẽ áp dụng tỷ giá của giao dịch chuyển tiền đi nước ngoài trực tuyến trên VCB Digibank thế
            nào?

                     A.   Là tỷ giá niêm yết trên website của VCB tại thời điểm khách hàng tạo lệnh chuyển tiền.
     290
                      B.  Là tỷ giá niêm yết trên website của VCB tại thời điểm VCB duyệt lệnh chuyển tiền.

                     C.   Là tỷ giá (tham chiếu tỷ giá niêm yết, điểm ưu đãi (nếu có)) tại thời điểm VCB duyệt lệnh chuyển tiền.

                      D.  Là tỷ giá VCB thông báo cho khách hàng tại thời điểm khách hàng tạo lệnh chuyển tiền.

            01.015 - KH Priority có thể sử dụng ưu đãi phòng chờ tại sân bay trong nước (ga nội địa và quốc tế) ở các
            sân bay nào?

                     A.   Nội Bài & Đà Nẵng
     291
                      B.  Nội Bài, Tân Sơn Nhất, Đà Nẵng, Cam Ranh

                     C.   Nội Bài, Tân Sơn Nhất, Đà Nẵng

                      D.  Đà Nẵng, Cam Ranh

            02.218 - Khách hàng thực hiện chuyển tiền đi nước ngoài qua Swift trên Digibank có thể khởi tạo lệnh
            chuyển tiền vào thời gian nào?

                     A.   24/7 (24 giờ trong ngày, 7 ngày trong tuần).

                      B.  Các ngày làm việc từ thứ 2 đến thứ 6 hàng tuần, các ngày làm bù, trừ ngày nghỉ/ngày lễ/ngày Tết, các
                          ngày mà VCB đóng cửa theo quy định của Nhà nước hoặc theo quy định của Ngân hàng
     292
                     C.   Trong giờ làm việc của các ngày làm việc từ thứ 2 đến thứ 6 hàng tuần, các ngày làm bù, trừ ngày
                          nghỉ/ngày lễ/ngày Tết, các ngày mà VCB đóng cửa theo quy định của Nhà nước hoặc theo quy định của
                          Ngân hàng.

                      D.  Trước 15h của các ngày làm việc từ thứ 2 đến thứ 6 hàng tuần, các ngày làm bù, trừ ngày nghỉ/ngày
                          lễ/ngày Tết, các ngày mà VCB đóng cửa theo quy định của Nhà nước hoặc theo quy định của Ngân
                          hàng.

            01.076 - Theo công văn số 2697/VCB-CSKH&SPBL ngày 12/05/2022 về triển khai gói giao dịch SME, KH SME
            sử dụng Gói SME online được ưu đãi miễn phí tài khoản số đẹp tối đa bao nhiêu chữ số cuối:

                     A.   3 chữ số cuối
     293
                      B.  4 chữ số cuối

                     C.   5 chữ số cuối

                      D.  6 chữ số cuối

            02.041 - Theo sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh nhỏ/kinh doanh lớn ngành thương
            mại Thực phẩm đồ uống bao gói sẵn (QĐ 2911 & 2919/QĐ-VCB-PTSPBL ngày 31/12/2023), điều kiện của
            khách hàng được sử dụng hàng hóa lưu kho (thực phẩm, đồ uống bao gói sẵn) làm tài sản bảo đảm là gì?

                     A.   - Khách hàng thuộc chuỗi ngành thực phẩm, đồ uống bao gói sẵn và là nhà phân phối cấp 1 hoặc cấp 3
                          - Khách hàng có xếp hạng tín dụng nội bộ hiện hành theo mô hình PD từ d trở lên

                      B.  Khách hàng không cần thiết phải cam kết cầm cố/thế chấp hàng hóa lưu kho mà VCB đã nhận làm tài
     294                  sản bảo đảm cho bất kỳ TCTD nào khác

                     C.   Khách hàng cam kết có thể thay thế hàng hóa lưu kho bằng tài sản bảo đảm khác trong trường hợp thời
                          gian sử dụng còn lại của hàng hóa lưu kho không đáp ứng theo yêu cầu của VCB

                      D.  - KH thuộc chuỗi ngành thương mại thực phẩm, đồ uống bao gói sẵn và là nhà phân phối cấp 1 hoặc
                          cấp 2 - KH có xếp hạng tín dụng nội bộ hiện hành theo mô hình PD từ b trở lên - KH cam kết không cầm
                          cố/ thế chấp Hàng hoá lưu kho mà VCB đã nhận làm tài sản bảo đảm cho bất kỳ TCTD nào khác - KH
                          cam kết thay thế Hàng hoá lưu kho bằng tài sản bảo đảm khác trong trường hợp thời gian sử dụng còn
                          lại của hàng hoá lưu kho không đáp ứng theo yêu cầu của VCB

            01.078 - Theo bộ chỉ tiêu kế hoạch năm 2024, chỉ tiêu SLKH có thẻ tín dụng được định nghĩa:

                     A.   Khách hàng đang có thẻ tín dụng còn hoạt động (không ở trạng thái khóa hủy hoặc hết hạn)

     295              B.  Khách hàng đang có thẻ còn hoạt động và phải có phát sinh doanh số trong kỳ báo cáo

                     C.   Khách hàng phát hành thẻ tín dụng mới trong giai đoạn năm 2024

                      D.  Tất cả các đáp án trên

            02.042 - Theo sản phẩm tài trợ vốn lưu động cho Khách hàng tổ chức bán lẻ kinh doanh nhỏ và kinh doanh
            lớn (theo QĐ 2912 & 2913/QĐ-VCB-PTSPBL ngày 31/12/2023), Trường hợp bảo đảm đầy đủ bằng tài sản có
            tính thanh khoản cao, Khách hàng cần đáp ứng điều kiện về lịch sử tín dụng như thế nào?

                     A.   Khách hàng không có nợ xấu (nợ từ nhóm 3 đến nhóm 5), nợ đã xử lý dự phòng rủi ro, nợ bán VAMC
                          theo quy định trong từng thời kỳ tại các TCTD tại thời điểm thẩm định, đề xuất cấp tín dụng
     296
                      B.  Khách hàng không có nợ nhóm 2 theo quy định trong từng thời kỳ tại các TCTD trong vòng 12 tháng gần
                          nhất tính đến thời điểm thẩm định, đề xuất cấp tín dụng

                     C.   Khách hàng không có khoản cấp tín dụng có vấn đề tại VCB tại thời điểm thẩm định, đề xuất cấp tín
                          dụng

                      D.  B & C

     297    01.081 - Để cải thiện kết quả KPI chỉ tiêu SLKH có thẻ tín dụng, CN cần:

                     A.   Phát triển khách hàng mới

                      B.  Gia hạn thẻ cho khách hàng sắp hay đã hết hạn & Giữ chân khách hàng đang có thẻ

                     C.   Tăng tỷ lệ thâm nhập trên các tệp khách hàng tiềm năng hiện hữu

                      D.   Tất cả các đáp án trên

             02.043 - Theo sản phẩm tài trợ vốn lưu động cho Khách hàng tổ chức bán lẻ kinh doanh nhỏ và kinh doanh
             lớn (theo QĐ 2912 & 2913/QĐ-VCB-PTSPBL ngày 31/12/2023), Điều kiện về hoạt động kinh doanh tối thiểu 01
             năm tính từ thời điểm đăng ký kinh doanh lần đầu (được xác định theo Giấy chứng nhận đăng ký doanh
             nghiệp/Giấy chứng nhận đăng ký hợp tác xã của Khách hàng và theo tra cứu trên Cổng thông tin quốc gia về
             đăng ký doanh nghiệp) đến thời điểm nào?

     298              A.   Thời điểm gặp khách hàng lần đầu

                       B.  Thời điểm bắt đầu thu thập hồ sơ và xem xét cấp tín dụng

                      C.   Thời điểm thẩm định, đề xuất cấp tín dụng

                      D.   Thời điểm sau giải ngân 01 tháng

             01.014 - KH Priority sẽ được nhận quà dưới hình thức nào vào ngày sinh nhật

                      A.   Chi nhánh tặng quà theo hình thức tiền chuyển khoản đối với KH phân hạng Kim Cương/Kim Cương
                           Elite (5 triệu/10 triệu)

     299               B.  Trụ sở chính tặng Điểm Rewards (2 triệu) đối với KH phân hạng vàng với KH đã đăng ký sử dụng VCB
                           Digibank.

                      C.   A & B đều đúng

                      D.   A & B đều sai

             02.146 - Khách hàng SME có nguy cơ mất cân đối tiền hàng khi nào

                      A.   Khi khách hàng không có đủ tiền mặt hoặc tài sản ngắn hạn có thể chuyển đổi thành tiền mặt để thanh
                           toán các khoản nợ ngắn hạn, như nợ phải trả trong vòng 1 năm

     300               B.  Khi khách hàng có nợ ngắn hạn lớn hơn tài sản ngắn hạn

                      C.   Khi khách hàng gặp khó khăn trong việc thu tiền từ khách hàng hoặc gặp khó khăn trong việc quản lý
                           vốn lưu động

                      D.   Cả A,B & C

             01.082 - Theo Công văn 1681 về Quản lí KH Ưu tiên, KH được định danh P4 và P4B có được tính vào chỉ tiêu
             số lượng Khách hàng Ưu tiên không?

                      A.   P4 và P4B đều được tính chỉ tiêu
     301
                       B.  P4 được tính chỉ tiêu, P4B không được tính chỉ tiêu

                      C.   Cả 2 định danh trên đều không được tính chỉ tiêu

                      D.   P4 không được tính chỉ tiêu, P4B được tính chỉ tiêu

             02.044 - Theo sản phẩm tài trợ vốn lưu động cho Khách hàng tổ chức bán lẻ kinh doanh nhỏ và kinh doanh
             lớn (theo QĐ 2912 & 2913/QĐ-VCB-PTSPBL ngày 31/12/2023), trường hợp hạn mức cho vay mới nhỏ hơn dư
             nợ theo hợp đồng cho vay theo hạn mức cũ, Chi nhánh cần thực hiện nội dung nào khi cấp lại hạn mức cho
             vay cho khách hàng?

                      A.   Chi nhánh thực hiện điều chỉnh cấp tín dụng để hạn mức cho vay mới bằng hạn mức cho vay cũ trước
                           đó
     302
                       B.  Chi nhánh tập trung thực hiện thu nợ về hạn mức cho vay mới của Khách hàng

                      C.   Chi nhánh tiếp tục giải ngân cho khách hàng theo hạn mức cho vay mới vì hai hạn mức không liên quan
                           đến nhau

                      D.   Chi nhánh yêu cầu khách hàng trả nợ toàn nợ dư nợ gốc, dư nợ lãi của hợp đồng cho vay theo hạn mức
                           cũ trước khi sử dụng hạn mức cho vay mới

             01.083 - KH Priority được tính chỉ tiêu số lượng KH cho chi nhánh nào ?

                      A.   CN mở CIF

     303               B.  CN giao dịch nhiều tiền gửi nhất với KH

                      C.   CN quản lí KH Priority

                      D.   CN giao dịch nhiều tiền vay nhất với KH


            02.045 - Theo sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh lớn/nhỏ ngành thương mại dược
            (theo QĐ 2917 & 2918/QĐ-VCB-PTSPBL ngày 31/12/2023), tỷ trọng lĩnh vực kinh doanh chính là thương mại
             hàng tiêu dùng - tiểu ngành thương mại dược phẩm cho người của khách hàng trong tổng doanh thu năm
            gần nhất là bao nhiêu?

     304              A.  20% doanh thu trở lên và/hoặc có tỷ lệ doanh thu cao nhất

                      B.  30% doanh thu trở lên và/hoặc có tỷ lệ doanh thu cao nhất

                      C.  40% doanh thu trở lên và/hoặc có tỷ lệ doanh thu cao nhất

                      D.  10% doanh thu trở lên và/hoặc có tỷ lệ doanh thu cao nhất

            01.010 - Có bao nhiêu tiêu chí phân hạng KH Priority từ 1/7/2024

                      A.  3 (Tiền gửi, tiền vay, tổ hợp & điều kiện tối thiểu về số dư Tiền gửi/Dư nợ vay)

     305              B.  3 (Tiền gửi, tiền vay, tổ hợp)

                      C.  4 (Tiền gửi, tiền vay, tổ hợp, vợ chồng)

                      D.  4 (Tiền gửi, tiền vay, vợ chồng, tổ hợp & điều kiện tối thiểu về số dư Tiền gửi/Dư nợ vay)

            02.046 - Công ty A có lĩnh vực kinh doanh chính là thương mại trang thiết bị y tế về răng hàm mặt với doanh
            thu năm gần nhất 50 tỷ đồng, Công ty tới Vietcombank CN B đề xuất vay vốn tài trợ hoạt động kinh doanh
             ngắn hạn - hạn mức vay đề nghị 35 tỷ đồng. Trường hợp khách hàng thỏa mãn các điều kiện của sản phẩm,
            chi nhánh sẽ thực hiện cấp tín dụng cho khách hàng theo sản phẩm nào sau đây?

                      A.  Chi nhánh cấp tín dụng cho khách hàng theo sản phẩm Tài trợ vốn lưu động đối với Khách hàng tổ chức
                          bán lẻ kinh doanh nhỏ theo Quyết định số 2912/QĐ-VCB-PTSPBL ngày 31/12/2023 v/v ban hành quy
                          định về sản phẩm tài trợ vốn lưu động đối với Khách hàng tổ chức bán lẻ kinh doanh nhỏ của Ngân
                          hàng TMCP Ngoại thương Việt Nam

     306              B.  Chi nhánh cấp tín dụng cho khách hàng theo sản phẩm Tài trợ vốn lưu động đối với Khách hàng tổ chức
                          bán lẻ kinh doanh lớn theo Quyết định số 2913/QĐ-VCB-PTSPBL ngày 31/12/2023 của Ngân hàng
                          TMCP Ngoại thương Việt Nam

                      C.  Chi nhánh cấp tín dụng cho khách hàng theo sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh
                          nhỏ ngành thương mại trang thiết bị y tế theo Quyết định số 2916/QĐ-VCB-PTSPBL ngày 31/12/2023
                          của Ngân hàng TMCP Ngoại thương Việt Nam

                      D.  Chi nhánh cấp tín dụng cho khách hàng theo sản phẩm Tài trợ Khách hàng tổ chức bán lẻ kinh doanh
                          lớn ngành thương mại trang thiết bị y tế theo Quyết định số 2914/QĐ-VCB-PTSPBL ngày 31/12/2023
                          của Ngân hàng TMCP Ngoại thương Việt Nam

            01.084 - Khi tính chỉ tiêu số lượng KH Ưu tiên, các KH đạt phân hạng Kim cương Elite và Kim cương có
            được tính tăng điểm hệ số vào số lượng KH Ưu tiên được tính chỉ tiêu không ?

                      A.  Có. KH Kim cương Elite được nhân hệ số 2 và KH Kim cương được nhân hệ số 1.8
     307
                      B.  Có. KH Kim cương Elite và Kim cương được nhân hệ số 1.5

                      C.  Có. KH Kim cương Elite và Kim cương được nhân hệ số 1.2

                      D.  Không. Phân hạng KH không ảnh hưởng đến việc tính chỉ tiêu số lượng KH Ưu tiên.

            02.145 - Ngân hàng đang đánh giá tình hình tài chính của Công ty X để tái cấp hạn mức ngắn hạn, báo cáo tài
            chính quý 1/2024 ghi nhận Nợ ngắn hạn và Tài sản cố định tăng mạnh so với thời điểm báo cáo tài chính
            31/12/2023. Tình hình tài chính của Công ty X có thể đang có rủi ro nào sau đây?

                      A.  Khách hàng tăng trưởng tài sản mạnh
     308
                      B.  Khách hàng mở rộng hoạt động kinh doanh

                      C.  Khách hàng sử dụng vốn ngắn hạn cho mục đích trung dài hạn.

                      D.  Khách hàng không có dấu hiệu rủi ro

     309    02.047 - Theo sản phẩm tài trợ Khách hàng tổ chức bán lẻ kinh doanh lớn ngành thương mại thực phẩm, đồ

             uống bao gói sẵn (theo Quyết định số 2919/QĐ-VCB-PTSPBL ngày 31/12/2023), giá trị hạn mức bảo lãnh
            và/hoặc số tiền bảo lãnh nào sau đây là phù hợp với quy định sản phẩm?

                      A.  - Giá trị hạn mức bảo lãnh và/hoặc số tiền bảo lãnh được xác định theo quy định hiện hành của VCB; và
                          - Không quá Hạn mức công nợ mà người bán cấp cho Khách hàng và - Không vượt quá Giới hạn tín
                          dụng ngắn hạn được cấp thẩm quyền phê duyệt hoặc được phân bổ và - Mọi trường hợp không vượt
                          quá 50 tỷ đồng.

                      B.  - Giá trị hạn mức bảo lãnh và/hoặc số tiền bảo lãnh được xác định theo quy định hiện hành của VCB; và
                          - Có thể vượt quá Hạn mức công nợ mà người bán cấp cho Khách hàng và - Không vượt quá Giới hạn
                          tín dụng ngắn hạn được cấp thẩm quyền phê duyệt hoặc được phân bổ

                      C.  - Giá trị hạn mức bảo lãnh và/hoặc số tiền bảo lãnh được xác định theo quy định hiện hành của VCB; và
                          - Không quá Hạn mức công nợ mà người bán cấp cho Khách hàng và - Có thể vượt quá Giới hạn tín
                          dụng ngắn hạn được cấp thẩm quyền phê duyệt hoặc được phân bổ và - Mọi trường hợp không vượt
                          quá 100 tỷ đồng.

                      D.  - Giá trị hạn mức bảo lãnh và/hoặc số tiền bảo lãnh được xác định theo quy định hiện hành của VCB; và
                          - Có thể vượt quá Hạn mức công nợ mà người bán cấp cho Khách hàng và - Không vượt quá Giới hạn
                          tín dụng ngắn hạn được cấp thẩm quyền phê duyệt hoặc được phân bổ và - Mọi trường hợp không vượt
                          quá 100 tỷ đồng.

            01.085 - Khách hàng đăng ký Digibank được tính KPI năm 2024 khi thỏa mãn điều kiện nào sau đây: 1) Khách
             hàng đăng ký Digibank mới năm 2024; 2) Khách hàng kích hoạt thành công Digibank lần đầu tiên trong đời
            trong năm 2024; 3) Khách hàng đang ở trạng thái kích hoạt tại thời điểm báo cáo

                      A.  2&3
     310
                      B.  2

                      C.  3

                      D.  Tất cả các điều kiện

            02.048 - Theo sản phẩm tài trợ vốn lưu động đối với Khách hàng tổ chức bán lẻ kinh doanh nhỏ/lớn, ngoài
            việc đánh giá các điều kiện kinh doanh của Khách hàng tổ chức bán lẻ trên cơ sở hồ sơ khách hàng cung
            cấp, Cán bộ thẩm định có thể căn cứ theo thông tin/ chứng từ sau đây?

                      A.  Biên lai, chứng từ nộp thuế, hóa đơn điện nước, viễn thông… trong vòng 12 tháng liền kề trước thời
                          điểm thẩm định, đề xuất cấp tín dụng

                      B.  Các nguồn thông tin tin cậy khác khi chi nhánh xem xét cấp tín dụng cho khách hàng như: sao kê TK
     311                  ngân hàng, và/hoặc văn bản xác nhận số dư ngân hàng, và/hoặc sổ sách ghi chép hoạt động kinh
                          doanh của KH, và/hoặc các hợp đồng kinh tế đầu vào/đầu ra lớn, và/hoặc biên bản đối chiếu công nợ
                          phải thu/phải trả đối với bên thứ ba… trong vòng 12 tháng liền kề trước thời điểm thẩm định, đề xuất cấp
                          tín dụng theo Quy định này;

                      C.  Các nguồn thông tin tin cậy khác khi chi nhánh xem xét cấp tín dụng cho khách hàng như: (i) nguồn
                          thông tin từ các phương tiện truyền thông chính thống (báo/đài/địa phương/quốc gia); (ii) trang web
                          chính thống của cơ quan nhà nước…

                      D.  Tất cả các đáp án trên

            01.008 - Vợ/Chồng của KH Priority được định danh là KH Priority trong trường hợp nào?

                      A.  Số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ hạn và có kỳ hạn bình quân trong 12 tháng liền
                          trước tính đến thời điểm xét định danh/cam kết duy trì trong 6 tháng tiếp theo từ 04 tỷ VND trở lên.

                      B.  Dư nợ (ngắn hạn, trung hạn và dài hạn) quy VND bình quân trong 12 tháng liền trước/cam kết duy trì
     312                  trong 6 tháng tiếp theo (loại trừ dư nợ đang được hưởng lãi suất cho vay theo Chính sách lãi suất cho
                          vay áp dụng đối với cán bộ VCB do Tổng Giám đốc VCB quy định từng thời kỳ) tính đến thời điểm xét
                          định danh từ 06 tỷ VND trở lên;

                      C.  A&B

                      D.  Có tổng doanh số chi tiêu thẻ tín dụng tích lũy trong 12 tháng liền trước tính đến thời điểm xét định danh
                          từ 300 triệu VND trở lên.

            02.049 - Theo sản phẩm cho vay trung dài hạn dành cho Khách hàng tổ chức bán lẻ kinh doanh nhỏ theo
            quyết định số 885/QĐ-VCB-PTSPBL ngày 27/05/2024, các khoản ghi có nào được tính vào tiêu chí doanh số
            ghi có về tài khoản của khách hàng tại VCB?

                      A.  Bút toán trả lãi tiền gửi tại VCB

     313              B.  Giao dịch chuyển tiền giữa các tài khoản tại VCB của cùng 01 CIF khách hàng

                      C.  Bút toán hoàn tiền do giao dịch thanh toán từ tài khoản thanh toán của khách hàng bị lỗi hoặc không
                          thực hiện thành công

                      D.  Bút toán ghi có tại tài khoản thanh toán của khách hàng tại VCB do đối tác đầu ra thanh toán tiền mua
                          hàng hóa của khách hàng

     314    01.086 - Thời gian hiệu lực của mật khẩu kích hoạt Digibank gửi về số điện thoại của khách hàng là bao lâu:

                      A.  48h

                      B.  24h

                      C.   1 phút

                      D.  5 phút

             02.050 - Công ty A hoạt động trong lĩnh vực kinh doanh lưu trú du lịch ngắn ngày (khách sạn) từ tháng
             09/2023, với quy mô 20 phòng nghỉ, 07 tầng 01 hầm để xe, tổng diện tích sử dụng ~ 600 m2; công suất phòng
             hoạt động bình quân trong 01 năm ~ 80%; có nhu cầu vay vốn nâng cấp cơ sở kinh doanh đang hoạt động.
             Cán bộ T đề xuất cấp thẩm quyền xem xét phê duyệt cho vay khách hàng không theo sản phẩm cho vay đầu
             tư cơ sở lưu trú du lịch dành cho KHBL (theo QĐ 2133/QĐ-VCB-PTSPBL ngày 22/11/2019) vì lý do nào (giả sử
             khách hàng đáp ứng các điều kiện về pháp lý, tài chính, tài sản bảo đảm theo quy định sản phẩm)?
     315
                      A.  Vi phạm điều kiện về thời gian hoạt động kinh doanh của cơ sở lưu trú du lịch < 24 tháng trở lên

                      B.  Vi phạm điều kiện về quy mô diện tích quá nhỏ và số tầng thấp

                      C.  Vi phạm điều kiện hiệu suất sử dụng phòng bình quân trong 01 năm đạt tối thiểu 85%

                      D.  A & C

             01.087 - Khi Khách hàng đăng ký Digibank mới, chỉ tiêu Phát triển KH Digibank được tính cho chi nhánh
             nào?

                      A.  Chi nhánh đăng ký Digibank
     316
                      B.  Chi nhánh quản lý CIF

                      C.  Chi nhánh quản lý tài khoản mặc định của Khách hàng trên Digibank

                      D.  Chi nhánh kích hoạt Digibank

             02.144 - Để đảm bảo KH SME sử dụng hạn mức thấu chi đúng mục đích cho hoạt động sản xuất kinh doanh,
             sản phẩm nên có điều kiện nào sau đây?

                      A.   Khách hàng cam kết bằng lời nói sử dụng vốn đúng mục đích.

     317              B.  Giới hạn tài khoản thụ hưởng là Nhà cung cấp của khách hàng trên hệ thống sử dụng Hạn mức thấu
                          chi.

                      C.  Thu thập giấy tờ chứng minh mục đích sử dụng vốn khớp với giao dịch đã thực hiện

                      D.  Cả B&C

             01.089 - Ứng dụng được Cán bộ bán hàng sử dụng để cập nhật báo cáo kết quả tiếp cận khách hàng tiềm
             năng theo từng chiến dịch bán hàng?

                      A.  Core Signature
     318
                      B.  Aperio

                      C.   BOL Manager

                      D.  Cả 3 đáp án trên

             02.054 - Theo CV 16917 ngày 01/12/2023 về hướng dẫn cho vay bù đắp cho KHCN: KH vay vốn theo Sản
             phẩm tín dụng và cung cấp 03 chứng từ thanh toán cho Bên thụ hưởng với ngày ghi trên hóa đơn lần lượt
             là: 5/3/2023, 20/8/2023, 30/12/2023. Ngày KH ghi trên Phương án sử dụng vốn là 15/6/2024. Vậy CN được xem
             xét cho vay bù đắp đối với những hóa đơn nào?

     319              A.   Hóa đơn ngày gần nhất so ngày ghi trên Phương án sử dụng vốn (hóa đơn ngày 30/12/2023)

                      B.   Hóa đơn ngày 20/8/2023 và ngày 30/12/2023

                      C.  Cả 3 hóa đơn

                      D.  Cấp thẩm quyền phê duyệt tín dụng chủ động quyết định hóa đơn nào được xem xét cho vay bù đắp

     320     01.003 - Tiêu chí định danh KH Priority tiền vay

                      A.   KHCN có dư nợ quy VND bình quân trong 12 tháng liền trước (loại trừ dư nợ đang được hưởng lãi suất
                          cho vay theo Chính sách lãi suất cho vay áp dụng đối với cán bộ VCB do Tổng Giám đốc VCB quy định
                          từng thời kỳ ) tính đến thời điểm xét định danh từ 03 tỷ VND trở lên

                      B.   KHCN có dư nợ quy VND (loại trừ dư nợ đang được hưởng lãi suất cho vay theo Chính sách lãi suất
                          cho vay áp dụng đối với cán bộ VCB do Tổng Giám đốc VCB quy định từng thời kỳ) từ 03 tỷ VND trở lên
                          tại thời điểm xét định danh và cam kết duy trì tổng dư nợ tối thiểu 03 tỷ VND trong vòng 06 tháng tiếp
                          theo.

                      C.  Tại thời điểm xét định danh và trong suốt thời gian được định danh KH Priority, KH không có nợ được
                          phân loại vào nợ nhóm 2 trở lên theo quy định của pháp luật tại các Tổ chức tín dụng. Trong vòng 12
                          tháng tính đến thời điểm xét định danh KH Priority, KH không có nợ được phân loại vào nợ nhóm 3 trở
                          lên theo quy định của pháp luật tại các Tổ chức tín dụng.

                      D.  A&B&C

            02.055 - Theo CV 16917 ngày 01/12/2023 và CV 18944 ngày 29/12/2023 về hướng dẫn cho vay bù đắp cho
             KHCN: trường hợp nào sau đây được VCB xem xét cho vay bù đắp?

                      A.  Khoản vay theo Sản phẩm tín dụng nhằm thực hiện dự án hoạt động kinh doanh thuộc thẩm quyền phê
                          duyệt tín dụng cấp Chi nhánh theo quy định của VCB từng thời kỳ

                      B.  Khoản vay không theo Sản phẩm tín dụng nhằm thực hiện phương án kinh doanh thuộc thẩm quyền phê
                          duyệt tín dụng cấp Giám đốc phê duyệt theo quy định của VCB từng thời kỳ

     321              C.  Khoản vay: (i) không theo Sản phẩm tín dụng nhằm thực hiện dự án hoạt động kinh doanh thuộc thẩm
                          quyền phê duyệt tín dụng là cấp Hội đồng tín dụng Trung ương theo quy định của VCB từng thời kỳ;
                          hoặc (ii) không theo Sản phẩm tín dụng nhằm thực hiện phương án phục vụ đời sống thuộc thẩm quyền
                          phê duyệt tín dụng cấp Lãnh đạo Phòng Phê duyệt tín dụng theo quy định của VCB từng thời kỳ

                      D.  Khoản vay: (i) không theo Sản phẩm tín dụng nhằm thực hiện phương án phục vụ đời sống thuộc thẩm
                          quyền phê duyệt tín dụng cấp Hội đồng tín dụng Trung ương theo quy định của VCB từng thời kỳ; hoặc
                          (ii) không theo Sản phẩm tín dụng nhằm thực hiện phương án kinh doanh thuộc thẩm quyền phê duyệt
                          tín dụng cấp Lãnh đạo Phòng Phê duyệt tín dụng theo quy định của VCB từng thời kỳ

            01.090 - Tập khách hàng cần tập trung khai thác để tăng doanh số sản phẩm bảo hiểm FWD Vững Ước Mơ?

                      A.  Priority không vay

     322              B.  Mass không vay

                      C.  Khách hàng vay

                      D.  Cả 3 đáp án trên

            02.060 - Theo Sản phẩm cho vay KHCN xây sửa nhà ở theo QĐ 1291 ngày 30/6/2023 và các văn bản điều
            chỉnh/bổ sung có liên quan, KH vay xây mới Nhà ở có bắt buộc cung cấp Giấy phép xây dựng không?

                      A.  Bắt buộc cung cấp Giấy phép xây dựng trong mọi trường hợp

                      B.  Chỉ cần cung cấp Giấy phép xây dựng trong trường hợp việc xây mới nhà phải xin Giấy phép xây dựng
                          theo quy định của pháp luật. Trường hợp việc xây mới nhà được miễn Giấy phép xây dựng: KH phải
     323                  cung cấp bổ sung hồ sơ sau tại thời điểm giải ngân: (i) Giấy chứng nhận đã đăng ký Quyền sở hữu nhà
                          ở; hoặc (ii) Giấy phép xây dựng các lần trước

                      C.  Chỉ cần cung cấp Giấy phép xây dựng trong trường hợp việc xây mới nhà phải xin Giấy phép xây dựng
                          theo quy định của pháp luật. Trường hợp việc xây mới nhà được miễn Giấy phép xây dựng, cung cấp: (i)
                          Hình chụp hiện trạng mặt bằng xây dựng trước khi xây mới nhà ở (tại thời điểm thẩm định và đề xuất
                          cho vay); và (ii) Hình chụp nhà ở sau khi xây mới (khi kiểm tra mục đích sử dụng vốn vay lần đầu).

                      D.  CN được lựa chọn áp dụng theo Phương án B và Phương án C

            01.091 - Theo bộ chỉ tiêu kế hoạch năm 2024, chỉ tiêu bảo hiểm nhân thọ được định nghĩa là:

                      A.  Doanh số phí bảo hiểm thực thu trong năm của các Hợp đồng bảo hiểm hợp tác giữa VCB và FWD

     324              B.  Doanh số phí bảo hiểm năm đầu thực thu của các Hợp đồng bảo hiểm hợp tác giữa VCB và FWD

                      C.  Doanh số phí bảo hiểm thực thu của các Hợp đồng bảo hiểm hợp tác giữa VCB và FWD

                      D.  Doanh số phí bảo hiểm thực thu trong năm của các Hợp đồng bảo hiểm do VCB hợp tác với các công ty
                          bảo hiểm

            02.142 - Cán bộ thông tin Khách hàng (CIS) không được thẩm định hồ sơ phát hành thẻ tín dụng của khách
             hàng nào sau đây?

                      A.  Khách hàng phát hành thẻ theo chính sách cấp Hạn mức tín dụng thẻ cho KH Priority

     325              B.  Khách hàng phát hành thẻ theo Quyền tự quyết của Giám đốc chi nhánh

                      C.  Khách hàng phát hành thẻ theo chính sách cấp hạn mức tín dụng đối với một số hạng Hội viên Bông
                          Sen Vàng của Vietnam Airlines

                      D.  Khách hàng phát hành thẻ theo chính sách bán kèm khoản vay

     326    01.002 - Tiêu chí định danh KH Priority tiền gửi

                      A.  KHCN của VCB có số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ hạn và có kỳ hạn bình quân
                          trong 12 tháng liền trước tính đến thời điểm xét định danh từ 02 tỷ VND trở lên

                      B.  KHCN của VCB có số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ hạn và có kỳ hạn từ 02 tỷ VND
                          trở lên tại thời điểm xét định danh và cam kết duy trì số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ
                          hạn và có kỳ hạn tối thiểu 02 tỷ VND trong vòng 06 tháng tiếp theo

                      C.  KHCN của VCB có số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ hạn và có kỳ hạn bình quân từ
                          02 tỷ VND trở lên

                      D.  KHCN của VCB có số dư tiền gửi (VND và ngoại tệ) quy VND không kỳ hạn và có kỳ hạn bình quân
                          trong 12 tháng liền trước/cam kết duy trì trong 6 tháng tính từ thời điểm xét định danh, từ 02 tỷ VND trở
                          lên

            02.061 - Theo Sản phẩm cho vay KHCN xây sửa nhà ở theo QĐ 1291 ngày 30/6/2023 và các văn bản điều
            chỉnh/bổ sung có liên quan, KH vay sửa chữa Nhà ở có bắt buộc cung cấp Giấy phép xây dựng không?

                      A.  Bắt buộc cung cấp Giấy phép sửa chữa trong trường hợp việc sửa chữa nhà phải có giấy phép theo quy
                          định của pháp luật

                      B.  Trường hợp việc sửa chữa nhà được miễn Giấy phép: Giấy chứng nhận đã đăng ký Quyền sở hữu nhà,
                          hoặc Giấy phép xây dựng/sửa chữa các lần trước, hoặc Trường hợp các lần sửa chữa/xây mới trước đó
     327                  được miễn Giấy phép: (i) Xác nhận của chính quyền địa phương về việc có nhà trên đất; (ii) Hình chụp
                          nhà ở trước khi sửa chữa (tại thời điểm thẩm định và đề xuất cho vay); và (ii) Hình chụp nhà ở sau khi
                          sửa chữa (khi kiểm tra mục đích sử dụng vốn vay lần đầu).

                      C.  Chỉ cần cung cấp Giấy phép sửa chữa trong trường hợp việc sửa nhà phải xin Giấy phép theo quy định
                          của pháp luật. Trường hợp việc sửa chữa được miễn Giấy phép: KH phải cung cấp bổ sung hồ sơ sau
                          tại thời điểm giải ngân: (i) Giấy chứng nhận đã đăng ký Quyền sở hữu nhà ở; hoặc (ii) Giấy phép sửa
                          nhà các lần trước

                      D.  A và B

            01.092 - Chỉ tiêu kế hoạch huy động vốn bán lẻ (HĐVBL) năm 2024 giao CN gồm những chỉ tiêu nào?

                      A.  HĐV thể nhân cuối kỳ, HĐV SME cuối kỳ, HĐV thể nhân BQ, HĐV SMEs BQ

     328              B.  HĐV BL cuối kỳ, HĐV BL BQ,Tỷ lệ tiền gửi KKH/ Tổng HDV

                      C.  HĐV BL cuối kỳ, HĐV BL BQ,Tỷ lệ tiền gửi KKH/ Tổng HDV, HDV BL PGD

                      D.  HĐV BL cuối kỳ, HĐV BL BQ

            02.069 - Theo Sản phẩm cho vay Người thân của Cán bộ VCB theo QĐ 100 ngày 27/01/2023 và các văn bản
            điều chỉnh/bổ sung có liên quan, mức cho vay tối đa được hưởng Chương trình Lãi suất dành cho Người
            thân Cán bộ VCB được thực hiện theo nguyên tắc nào?

                      A.  KH được hưởng mức cho vay tối đa bằng mức áp dụng cho Cán bộ VCB theo quy định tại Sản phẩm
                          cho vay Cán bộ VCB tiêu dùng có tài sản bảo đảm. Trường hợp KH là Người thân của nhiều Cán bộ
                          VCB: được hưởng tổng mức cho vay tối đa áp dụng cho từng Cán bộ VCB

                      B.  KH và Cán bộ VCB được hưởng chung mức cho vay tối đa theo các mức quy định tại Sản phẩm cho
     329                  vay Cán bộ VCB tiêu dùng có tài sản bảo đảm. Trường hợp KH là Người thân của nhiều Cán bộ VCB:
                          được hưởng mức cho vay tối đa bằng mức cho vay cao nhất trong số các Cán bộ VCB

                      C.  KH được hưởng mức cho vay tối đa bằng mức áp dụng cho Cán bộ VCB theo quy định tại Sản phẩm
                          cho vay Cán bộ VCB tiêu dùng có tài sản bảo đảm. Trường hợp KH là Người thân của nhiều Cán bộ
                          VCB: được hưởng mức cho vay tối đa bằng mức cho vay cao nhất trong số các Cán bộ VCB

                      D.  KH và Cán bộ VCB được hưởng chung mức cho vay tối đa theo các mức quy định tại Sản phẩm cho
                          vay Cán bộ VCB tiêu dùng có tài sản bảo đảm. Trường hợp KH là Người thân của nhiều Cán bộ VCB:
                          được hưởng tổng mức cho vay tối đa áp dụng cho từng Cán bộ VCB

            01.125 - KH Priority đóng góp bao nhiêu trong tổng thu nhập của Khối bán lẻ năm 2023?

                      A.  60%

     330              B.  75%

                      C.  49%

                      D.  30%

     331    02.074 - Theo CV 18675 về bộ điều kiện cho vay tối thiểu áp dụng cho các Sản phẩm BĐS và các văn bản
            điều chỉnh/bổ sung có liên quan, số tiền trả nợ quy tháng để tính Hệ số trả nợ của KH tại thời điểm thẩm định
            và đề xuất cho vay không bao gồm trường hợp nào?

                     A.   Khoản vay Sản xuất kinh doanh trung hạn tại BIDV có chung nguồn trả nợ đối với khoản vay theo Sản
                          phẩm

                      B.  Khoản vay Sản xuất kinh doanh ngắn hạn tại BIDV có lịch trả nợ lãi hàng tháng

                     C.   Khoản vay được cầm cố bằng GTCG tại BIDV có lịch trả nợ gốc và lãi hàng tháng

                      D.  Cả 3 phương án trên

            12.006 - Các chuẩn mực ứng xử của cán bộ VCB:

                     A.   Tôn trọng đối tác tiếp xúc; Tuân thủ quy định của luật pháp và nội bộ

     332              B.  Tận tâm, hết lòng vì lợi ích VCB

                     C.   Hợp tác, hoà đồng cùng đồng nghiệp; Ứng xử chân thành, lịch sự và thân thiện

                      D.  Tất cả các đáp án trên

            08.023 - TSBĐ là ô tô thương hiệu Trung Quốc, mới 100%, giá trị định giá 2 tỷ đồng ( định giá theo phương
            pháp chi phí, đã so sánh với giá thị trường và không vượt quá giá thị trường). Theo quy định của VCB, mức
            cấp tín dụng tối đa trên giá trị TSBĐ đối với TSBĐ trên là bao nhiêu?

                     A.   70%
     333
                      B.  60%

                     C.   50%

                      D.  0%

            08.033 - Ngày 14/06/2024, Cán bộ A muốn tra cứu sản phẩm S10A của Khách hàng X. Cán bộ A tra cứu trên
            Hệ thống CIS có 2 bản hỏi tin tương tự ở trạng thái "Đã có kết quả" ngày 28/05/2024 và ngày 12/05/2024. Cán
            bộ A thực hiện:

                     A.   Sử dụng một trong hai hản hỏi tin đã có sẵn trên Hệ thống CIS
     334
                      B.  Sử dụng bản hỏi tin ngày 28/05/2024

                     C.   Tác nghiệp hỏi tin mới trên CIS

                      D.  Phương án B hoặc phương án C tùy thuộc nhu cầu về thẩm định tín dụng đối với khách hàng

            08.022 - Khách hàng Nguyễn Văn A có nhu cầu cấp tín dụng tại VCB: - Giá trị khoản cấp tín dụng: 10 tỷ VND -
            TSBĐ là Sổ tiết kiệm do VCB phát hành với số tiền 100.000 USD và một số TSBĐ khác Theo quy định của
            VCB, mức cấp tín dụng tối đa trên giá trị TSBĐ của TSBĐ là sổ tiết kiệm nêu trên là bao nhiêu?

                     A.   95%
     335
                      B.  100%

                     C.   90%

                      D.  Không đáp án nào đúng

            08.021 - Khách hàng SME X dự định sử dụng các tài sản dưới đây làm TSBĐ cho khoản vay sản xuất kinh
            doanh của khách hàng SME X tại VCB. Tài sản nào dưới đây có thể xem xét nhận làm BPBĐ chính thức theo
            quy định của pháp luật và VCB?

                     A.   Cổ phiếu do Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV) phát hành
     336
                      B.  Trái phiếu do khách hàng SME X phát hành

                     C.   Tài sản của Công ty CP chứng khoán VNDirect

                      D.  Cổ phiếu do Ngân hàng TMCP Ngoại thương Việt Nam (VCB) phát hành

            08.020 - Khách hàng Nguyễn Thị B có nhu cầu thế chấp một số tài sản là bất động sản để vay vốn tại VCB -
            Chi nhánh X. Theo quy định của VCB, Hợp đồng thế chấp nào sau đây phải thực hiện công chứng?

                     A.   Hợp đồng thế chấp Quyền sử dụng đất của Khách hàng Nguyễn Thị B
     337
                      B.  Hợp đồng thế chấp Quyền sử dụng đất và tài sản gắn liền với đất của Khách hàng Nguyễn Thị B

                     C.   Hợp đồng thế chấp Nhà ở của Khách hàng Nguyễn Thị B

                      D.  Tất cả các tài sản trên


            08.041 - Khách hàng doanh nghiệp A (không phải FDI) (i) không có hợp đồng nào là khoản cấp tín dụng
            chuyên biệt, (ii) có báo cáo tài chính 01 năm kể từ khi có doanh thu từ hoạt động sản xuất kinh doanh;(iii)
            doanh thu thuần năm gần nhất là 80 tỷ VND. Doanh nghiệp chấm điểm xếp hạng tín dụng PD theo mô hình
             nào?

     338              A.  Mô hình XHTD PD doanh nghiệp FDI

                      B.  Mô hình XHTD PD doanh nghiệp quy mô trung bình

                      C.  Mô hình XHTD PD doanh nghiệp nhỏ và vừa

                      D.  Mô hình XHTD PD doanh nghiệp mới thành lập

            08.019 - Khách hàng Nguyễn Văn A đề nghị cầm cố sổ tiết kiệm do VCB phát hành giá trị 10 tỷ đồng để đảm
             bảo cho khoản vay mua nhà ở của chính Ông A tại Ngân hàng VCB - Chi nhánh X. Theo quy định của VCB, tài
            sản này do Bộ phận/Đơn vị nào thẩm định giá?

                      A.  Bộ phận Thẩm định tín dụng Trụ sở chính
     339
                      B.  Trung tâm định giá tài sản

                      C.  Phòng Quản lý nợ của Chi nhánh X

                      D.  Bộ phận Thẩm định tín dụng của Chi nhánh X

            08.015 - Mô tả tình huống: - Phòng giao dịch A tiếp cận được một KH SME X (không phải KH Micro SME)
            đang có nhu cầu vay vốn hạn mức 6 tỷ VNĐ, khoản vay được bảo đảm đầy đủ, KH đủ điều kiện vay vốn theo
            quy định của VCB. - Theo quy định về thẩm quyền tín dụng hiện hành, mức thẩm quyền tối đa của Lãnh đạo
            Chi nhánh đối với phân khúc KH SME X là 5 tỷ VNĐ, của HĐTDCS là 8 tỷ VNĐ. Câu hỏi: Quy trình cấp tín
            dụng cho KH X được thực hiện như thế nào?

                      A.  - PGD A thẩm định hồ sơ sau đó trình HĐTDCS của CN phê duyệt tín dụng. - Sau khi được HĐTDCS
                          phê duyệt tín dụng, PGD A thực hiện các công việc tiếp theo (soạn thảo ký HĐTD/HĐBĐ, kiểm tra hồ sơ
                          giải ngân, thu nợ …)

     340              B.  - PGD A nhận hồ sơ và chuyển toàn bộ về cho P.KHBL - P.KHBL tại CN thực hiện bước tiếp nhận hồ sơ,
                          lập BC NCTD và báo cáo thẩm định tín dụng. - P.KHBL tại CN trình HĐTDCS phê duyệt tín dụng -
                          P.KHBL thực hiện các công việc tiếp theo để hoàn thiện HĐTD/HĐBĐ - PGD A kiểm tra hồ sơ giải ngân,
                          thu nợ

                      C.  - PGD A nhận hồ sơ, lập BC NCTD và chuyển toàn bộ hồ sơ về cho P.KHBL tại CN . - P.KHBL của CN
                          thẩm định tín dụng và trình HĐTDCS phê duyệt tín dụng, - P.KHBL thực hiện các công việc tiếp theo và
                          quản lý toàn diện khách hàng (soạn thảo ký HĐTD/HĐBĐ, kiểm tra hồ sơ giải ngân, thu nợ …).

                      D.  - PGD A nhận hồ sơ và chuyển toàn bộ về cho P.KHBL tại CN - P.KHBL tại CN thực hiện bước tiếp nhận
                          hồ sơ, lập BC NCTD và báo cáo thẩm định tín dụng. - P.KHBL của CN trình HĐTDCS phê duyệt tín dụng
                          - PGD thực hiện các công việc tiếp theo (soạn thảo ký HĐTD/HĐBĐ, kiểm tra hồ sơ giải ngân, thu nợ …)

            08.014 - Mô tả tình huống: - Phòng giao dịch A trực thuộc chi nhánh B có số lượng nhân sự như sau: 01
            Trưởng phòng có 03 năm kinh nghiệm tín dụng, 01 Phó phòng không có kinh nghiệm tín dụng, 01 CBKH, 01
            CBTĐ. - Ngày 10/06/2024 đế hết ngày 14/06/2024, Trưởng phòng nghỉ phép bắt buộc theo quy định của VCB,
             Phó phòng thực hiện thay các công việc của Trưởng phòng. - Ngày 12/06/2024, Khách hàng cá nhân X đến
            đề nghị vay mua nhà ở dự án thế chấp bằng chính nhà mua (thuộc thẩm quyền phê duyệt của Trưởng PGD
            A) và có nhu cầu thông báo kết quả phê duyệt trước ngày 14/06/2024. Câu hỏi: Đối với Khoản vay của khách
             hàng X, cách xử lý tình huống này như thế nào là đúng quy định?

     341              A.  Phó phòng giao dịch A rà soát hồ sơ cho vay của khách hàng X sau khi CBTĐ PGD A thẩm định, trình
                          LĐ chi nhánh B phê duyệt.

                      B.  Phó phòng giao dịch A phê duyệt khoản cho vay đối với khách hàng X, sau khi CBTĐ PGD A thẩm định.

                      C.  Phó phòng giao dịch A thẩm định hồ sơ cho vay của khách hàng X, trình LĐ chi nhánh B phê duyệt.

                      D.  Phòng giao dịch A chuyển hồ sơ cho P.KHBL Chi nhánh B thực hiện tiếp nhận hồ sơ, thẩm định và trình
                          cấp thẩm quyền phê duyệt theo quy định tại Quy trình cấp tín dụng đối với khách hàng bán lẻ tín dụng
                          và Quy định về thẩm quyền phê duyệt tín dụng đối với khách hàng bán lẻ hiện hành.

     342    08.013 - CBTĐ tiếp nhận hồ sơ khách hàng cá nhân X từ CBKH, CBKH cung cấp hồ sơ nào sau đây không
            đúng đối với hồ sơ tra cứu thông tin về cư trú theo quy định của VCB?

                      A.  Căn cước công dân gắn chíp còn hiệu lực của khách hàng X

                      B.  Thông tin cư trú trên tài khoản VNeID mức độ 2 khách hàng X còn hiệu lực

                      C.  Thông tin cư trú trên tài khoản của chính khách hàng X trên Cổng dịch vụ công quốc gia còn hiệu lực

                     D.  Giấy xác nhận thông tin về cư trú của khách hàng X do cơ quan đăng ký cơ trú có thẩm quyền cấp còn
                          hiệu lực

            08.043 - Đối với các khoản mua, đầu tư TPDN của khách hàng SMEs, cán bộ thẩm định thực hiện thẩm định,
            đề xuất mua TPDN theo quy trình tín dụng nào?

                     A.  Theo Quy trình tín dụng KHBB do cấp thẩm quyền phê duyệt các khoản mua TPDN là HĐTD Trung
                          Ương

     343              B. Theo Quy trình tín dụng KHBB hoặc Quy trình do cấp thẩm quyền phê duyệt các khoản mua TPDN là
                          HĐTD Trung Ương

                     C.  Theo Quy trình tín dụng KH SME

                     D.  Theo Quy trình mua TPDN, trong đó quy định Đơn vị thực hiện thẩm định khi đề xuất mua TPDN theo
                         quy trình tín dụng tương ứng với phân khúc khách hàng phù hợp. Trong trường hợp này, thực hiện theo
                         Quy trình tín dụng KH SME

            08.012 - Mô tả tình huống: - Chi nhánh B có P.KHBL và Phòng giao dịch A - Phòng giao dịch A trực thuộc chi
            nhánh B có số lượng nhân sự như sau: 01 Trưởng phòng có 03 năm kinh nghiệm tín dụng, 01 Phó phòng
            không có kinh nghiệm tín dụng, 01 CBKH, 01 CBTĐ. - Ngày 10/06/2024 đến hết ngày 14/06/2024, CBTĐ nghỉ
            phép bắt buộc theo quy định của VCB và không bố trí được CBTĐ thay thế. - Ngày 12/06/2024, Khách hàng
            cá nhân X đến đề nghị vay mua nhà ở dự án thế chấp bằng chính nhà mua (thuộc thẩm quyền phê duyệt của
            Trưởng PGD A) và có nhu cầu thông báo kết quả phê duyệt trước ngày 14/06/2024. Câu hỏi: Khoản vay của
     344    khách hàng X ai là người thực hiện thẩm định?

                     A.  Trưởng PGD A

                      B.  Phó PGD A

                     C.  CBTĐ P.KHBL chi nhánh B

                     D.  CBKH

            08.010 - Khách hàng cá nhân C đề nghị vay vốn tại Phòng giao dịch M thuộc Chi nhánh VCB Z. Thông tin về
            khoản đề nghị vay vốn và tình hình quan hệ tín dụng của khách hàng C tại VCB: - Khoản đề nghị vay vốn
            không theo sản phẩm với số tiền 01 tỷ đồng để sửa chữa nhà ở. - Khách hàng đang có dư nợ vay 02 tỷ đồng
            tại Phòng giao dịch M, dư nợ vay được bảo đảm đầy đủ bằng sổ tiết kiệm tại BIDV. Cấp có thẩm quyền phê
            duyệt khoản cấp tín dụng cho khách hàng C lần này là cấp nào?
     345
                     A.   Lãnh đạo Phòng giao dịch M

                      B. Giám đốc Chi nhánh

                     C.   Hội đồng tín dụng cơ sở

                     D.  Chuyên gia phê duyệt cấp 3

            08.009 - Công ty B là doanh nghiệp nhỏ và siêu nhỏ tín dụng theo quy định tại VCB. Công ty B đề nghị vay
            vốn tại Phòng Khách hàng Bán lẻ - Chi nhánh VCB Y số tiền 01 tỷ đồng với tỷ lệ bảo đảm là 80%. Cấp có
            thẩm quyền phê duyệt khoản cấp tín dụng cho Công ty B là cấp nào?

                     A.   Lãnh đạo Phòng Khách hàng bán lẻ
     346
                      B. Giám đốc Chi nhánh

                     C.  Chuyên gia phê duyệt cấp 3

                     D.   Không có đáp án đúng

            08.024 - TSBĐ là Nhà ở đã được cấp Giấy chứng nhận sở hữu, giá trị định giá là 5 tỷ đồng (định giá theo Đơn
            giá xây dựng, đã so sánh với giá thị trường và không vượt quá giá thị trường). Theo quy định của VCB, mức
            cấp tín dụng tối đa trên giá trị TSBĐ đối với TSBĐ trên là bao nhiêu?

                     A.  60%
     347
                      B.  100%

                     C.  80%

                     D.  50%

     348    08.045 - Trong cấu phần Dấu hiệu cảnh báo của mô hình XHTD PD khách hàng Doanh nghiệp vừa và nhỏ (R-
            SME), đối với câu hỏi "Khách hàng chủ chốt của doanh nghiệp bị vỡ nợ", tiêu chí xác định Khách hàng chủ
            chốt của doanh nghiệp được hướng dẫn tại Sổ tay hướng dẫn XHTD PD cho KHDN là như thế nào?

                     A.   Là các khách hàng đóng góp từ 20% doanh thu của doanh nghiệp trở lên

                      B.  Là các khách hàng đóng góp từ 25% doanh thu của doanh nghiệp trở lên

                      C.  Là các khách hàng đóng góp từ 30% doanh thu của doanh nghiệp trở lên

                      D.  Là các khách hàng đóng góp từ 40% doanh thu của doanh nghiệp trở lên

            08.008 - Khách hàng cá nhân A đề nghị vay vốn không theo sản phẩm tại Chi nhánh VCB X. 1. Thông tin về
             phương án vay vốn của khách hàng A như sau: - Số tiền đề nghị vay 10 tỷ đồng - Thời hạn vay vốn: 20 năm -
             Mục đích vay: mua nhà để ở - Khách hàng và người thân của khách hàng A chưa từng có quan hệ tín dụng
            tại VCB 2. Thông tin về hạn mức thẩm quyền của cấp thẩm quyền Giám đốc Chi nhánh tại Chi nhánh X: -
            Thẩm quyền phê duyệt cấp tín dụng không theo sản phẩm là 10 tỷ đồng; - Thẩm quyền phê duyệt theo tổng
             khách hàng là 35 tỷ đồng. Cấp có thẩm quyền phê duyệt khoản cấp tín dụng cho khách hàng A là cấp nào?
     349
                      A.  Giám đốc Chi nhánh

                      B.  Chuyên gia phê duyệt cấp 3

                      C.  Chuyên gia phê duyệt cấp 2

                      D.  Không có đáp án đúng

            08.006 - Ngày 01/5/2024, Công ty TNHH A đề nghị vay bù đắp tài chính đối với phương án đầu tư dây chuyền
            sản xuất bánh kẹo đã hoàn thành đầu tư trong năm 2023. Tổng mức đầu tư của dự án là 10 tỷ; giá trị còn lại
            của TSCĐ hạch toán trên sổ sách đến thời điểm gần nhất là 9 tỷ. Khoản vay được đảm bảo đầy đủ bằng
            TSBĐ không phải TSBĐ có tính thanh khoản cao. Mức cho vay bù đắp tối đa có thể xem xét theo quy định
             hiện hành của VCB là:

     350              A.  8,5 tỷ

                      B.  7,65 tỷ

                      C.  9 tỷ

                      D.  10 tỷ

            08.005 - Khách hàng X đang có khoản vay sản xuất kinh doanh tại Ngân hàng M, khoản vay đã được cơ cấu
             nợ giữ nguyên nhóm nợ do bị ảnh hưởng bởi dịch Covid, khách hàng đang trả nợ đúng theo lịch đã cơ cấu
            và toàn bộ dư nợ ở nhóm 1 theo thông tin CIC. Khoản vay đến hạn ngày 31/12/2025. Nhận định nào sau đây
             là đúng?

                      A.  Chi nhánh được xem xét cho vay trả nợ trước hạn khoản vay tại Ngân hàng M với thời hạn cho vay
                          không vượt quá 31/12/2025.
     351
                      B.  Chi nhánh được xem xét cho vay trả nợ trước hạn khoản vay tại Ngân hàng M với thời hạn cho vay phù
                          hợp với đề nghị, kế hoạch SXKD, khả năng trả nợ của khách hàng của khách hàng.

                      C.  Chi nhánh không xem xét cho vay trả nợ trước hạn khoản vay tại Ngân hàng M do khoản vay đó đã thực
                          hiện cơ cấu lại thời hạn trả nợ.

                      D.  Tất cả các đáp án trên đều sai

            08.038 - Khoản nợ ngắn hạn của khách hàng cá nhân A được cơ cấu lại thời hạn trả nợ lần thứ hai. Khoản
             nợ bị quá hạn 01 ngày theo thời hạn trả nợ được cơ cấu lại lần thứ hai, VCB thực hiện phân loại khoản nợ
             này vào nhóm mấy?

                      A.  Nhóm 2
     352
                      B.  Nhóm 3

                      C.  Nhóm 4

                      D.  Nhóm 5

            08.037 - Thời hạn cấp tín dụng đối với khoản cấp tín dụng để đầu tư, kinh doanh cố phiếu theo quy định hiện
             hành là:

                      A.  Tối thiểu 12 tháng
     353
                      B.  Tối đa 12 tháng

                      C.  Tối đa 24 tháng

                      D.  Không quy định thời hạn tối đa

     354    08.036 - Các Đơn vị cần thực hiện quản lý rủi ro về môi trường trong hoạt động cấp tín dụng đối với dự án

            đầu tư khi nào?

                      A.  Trong quá trình xem xét, thẩm định cấp tín dụng

                      B.  Trong quá trình phê duyệt cấp tín dụng

                      C.  Trong quá trình quản lý tín dụng

                      D.  Cả 3 đáp án trên.

            08.035 - VCB thực hiện cho vay mua vàng để kinh doanh cho các đối tượng sau:

                      A.  1.Khách hàng là pháp nhân có thương hiệu (thuộc danh sách thương hiệu quốc gia công bố năm liền kề
                          trước thời điểm xem xét thẩm định, cấp tín dụng) và có kinh nghiệm (tối thiểu 5 năm kinh nghiệm hoạt
                          động trong ngành kinh doanh và/hoặc sản xuất và/hoặc gia công vàng trang sức, mỹ nghệ). 2. Khách
                          hàng là pháp nhân khác (không thuộc đối tượng khách hàng nêu tại Điểm a trên đây) 3. Khách hàng là
                          cá nhân vay vốn phục vụ hoạt động kinh doanh của doanh nghiệp tư nhân do Khách hàng cá nhân đó là
                          chủ sở hữu.

                      B.  1.Khách hàng là pháp nhân có thương hiệu (thuộc danh sách thương hiệu quốc gia công bố năm liền kề
                          trước thời điểm xem xét thẩm định, cấp tín dụng) và có kinh nghiệm (tối thiểu 5 năm kinh nghiệm hoạt
                          động trong ngành kinh doanh và/hoặc sản xuất và/hoặc gia công vàng trang sức, mỹ nghệ). 2. Khách
                          hàng là pháp nhân khác (không thuộc đối tượng khách hàng nêu tại Điểm 1 trên đây) 3. Khách hàng là
                          cá nhân vay vốn phục vụ hoạt động kinh doanh của Hộ kinh doanh do Khách hàng cá nhân đó là chủ hộ.
                          4. Khách hàng là cá nhân vay vốn phục vụ hoạt động kinh doanh của doanh nghiệp tư nhân do Khách
                          hàng cá nhân đó là chủ sở hữu.
     355
                      C.  1. Khách hàng là pháp nhân bao gồm: a. Khách hàng pháp nhân có thương hiệu (thuộc danh sách
                          thương hiệu quốc gia công bố năm liền kề trước thời điểm xem xét thẩm định, cấp tín dụng) và có kinh
                          nghiệm (tối thiểu 5 năm kinh nghiệm hoạt động trong ngành kinh doanh và/hoặc sản xuất và/hoặc gia
                          công vàng trang sức, mỹ nghệ). b. Khách hàng có công ty mẹ (sở hữu 100% vốn điều lệ của khách
                          hàng) đáp ứng điểm a nêu trên. 2. Khách hàng là pháp nhân khác (không thuộc đối tượng khách hàng
                          nêu tại Điểm 1 trên đây) 3. Khách hàng là cá nhân vay vốn phục vụ hoạt động kinh doanh của Hộ kinh
                          doanh do Khách hàng cá nhân đó là chủ hộ.

                      D.  1. Khách hàng là pháp nhân bao gồm: a. Khách hàng pháp nhân có thương hiệu (thuộc danh sách
                          thương hiệu quốc gia công bố năm liền kề trước thời điểm xem xét thẩm định, cấp tín dụng) và có kinh
                          nghiệm (tối thiểu 5 năm kinh nghiệm hoạt động trong ngành kinh doanh và/hoặc sản xuất và/hoặc gia
                          công vàng trang sức, mỹ nghệ). b. Khách hàng có công ty mẹ (sở hữu 100% vốn điều lệ của khách
                          hàng) đáp ứng điểm a nêu trên. 2. Khách hàng là pháp nhân khác (không thuộc đối tượng khách hàng
                          nêu tại Điểm 1 trên đây) 3. Khách hàng là cá nhân vay vốn phục vụ hoạt động kinh doanh của Hộ kinh
                          doanh do Khách hàng cá nhân đó là chủ hộ. 4. Khách hàng là cá nhân vay vốn phục vụ hoạt động kinh
                          doanh của doanh nghiệp tư nhân do Khách hàng cá nhân đó là chủ sở hữu.

            08.034 - Ngày 15/06/2024, Khách hàng cung cấp hồ sơ chứng minh mục đích sử dụng vốn vay, trong đó có
             hai hóa đơn. Hóa đơn thứ nhất dưới hình thức là bản in của hóa đơn điện tử với giá trị mua bán trên hóa
            đơn là 200 triệu đồng và có đầy đủ chữ ký, con dấu của khách hàng. Hóa đơn thứ hai dưới hình thức hóa
            đơn điện tử chuyển đổi thành hóa đơn giấy có giá trị 100 triệu đồng chưa có chữ ký và con dấu của khách
             hàng. Chi nhánh kiểm tra và yêu cầu Khách hàng:

     356              A.  Yêu cầu Khách hàng cung cấp hóa đơn điện tử chuyển đổi thành hóa đơn giấy đối với hóa đơn thứ nhất

                      B.  Không yêu cầu gì thêm đối với khách hàng do hóa đơn thứ nhất đã có đầy đủ chữ ký, con dấu của
                          khách hàng và có giá trị cao hơn hóa đơn thứ hai

                      C.  Yêu cầu khách hàng bổ sung chữ ký và con dấu đối với hóa đơn thứ hai

                      D.  A hoặc B

            08.042 - Doanh nghiệp A đang thực hiện vay vốn tại TCTD khác, đồng thời TCTD đó cũng đang nắm giữ
            TPDN do Doanh nghiệp A phát hành. Tuy nhiên, Doanh nghiệp A có nhu cầu chuyển toàn bộ nợ vay và nợ
            Trái phiếu về VCB --> VCB có được mua lại TPDN đó không?

                      A.  Không được mua lại TPDN do TCTD khác nắm giữ
     357
                      B.  Không được mua TPDN thứ cấp

                      C.  Được mua trong trường hợp đáp ứng quy định của VCB đối với nguyên tắc thực hiện mua TPDN, điều
                          kiện mua TPDN thứ cấp và điều kiện DNPH

                      D.  Được mua với điều kiện đáp ứng quy định của VCB liên quan đến mua TPDN thứ cấp

     358    08.026 - Hệ thống các văn bản định hướng ngành (Thông báo định hướng ngành, báo cáo ngành) được tra

            cứu tại địa chỉ nào?

                      A.  Trang sharepoint thông tin tín dụng https://hosps.vietcombank.com.vn/ci/SitePages/Home.aspx

                      B.  Trang thư viện điện tử https://intranet.vietcombank.com.vn/Pages/thu-vien-dien-tu.aspx

                      C.  Cả 2 đáp án A và B đều đúng

                      D.  Không có phương án nào đúng

            08.025 - Khách hàng Nguyễn Văn An có nhu cầu tạm xuất hồ sơ TSBĐ để công chứng hồ sơ TSBĐ. Theo quy
            định của VCB, thời hạn cho phép Khách hàng tạm xuất hồ sơ TSBĐ hồ sơ TSBĐ là bao lâu?

                      A.  Tối đa nửa ngày làm việc
     359
                      B.  Tối đa 01 ngày làm việc

                      C.  Tối đa 02 ngày làm việc

                      D.  Không quy định thời gian tối đa.

            08.018 - TSBĐ nào không bắt buộc phải lập biên bản kiểm tra thực tế tài sản?

                      A.  TSBĐ là Tiền gửi tiết kiệm

     360              B.  TSBĐ là Quyền sử dụng đất

                      C.  TSBĐ là Tài sản hình thành trong tương lai chưa hình thành (trừ Tài sản hình thành trong tương lai đã
                          hình thành một phần) tại thời điểm thẩm định

                      D.  A và C đều đúng

            08.044 - KHCN vay để đầu tư, kinh doanh cổ phiếu niêm yếu có được chấm điểm PD KHCN với mục đích sản
            xuất kinh doanh không?

                      A.  Có vì mục đích vay để kinh doanh
     361
                      B.  Có vì mục đích vay để kinh doanh cổ phiếu niêm yết

                      C.  Không vì mục đích vay này được xếp vào phạm vi chấm điểm PD đối với cho vay tiêu dùng

                      D.  Không do mục đích vay này không thuộc phạm vi mô hình PD KHCN cho vay sản xuất kinh doanh

            08.016 - Tài sản nào sau đây không được nhận làm tài sản bảo đảm?

                      A.  Tài sản của thành viên Hội đồng quản trị, thành viên Ban Kiểm soát, Tổng Giám đốc, Phó Tổng Giám
                          đốc và các chức danh tương đương của VCB

     362              B.  Tài sản của cha, mẹ, vợ, chồng, con của thành viên Hội đồng quản trị, thành viên Ban Kiểm soát, Tổng
                          Giám đốc, Phó Tổng Giám đốc và các chức danh tương đương của VCB

                      C.  Tài sản của pháp nhân là cổ đông có người đại diện phần vốn góp là thành viên Hội đồng quản trị, Ban
                          kiểm soát VCB

                      D.  Tất cả các tài sản trên

            08.002 - Khách hàng vay vốn tại VCB bao gồm:

                      A.  a) Pháp nhân được thành lập và hoạt động tại Việt Nam, pháp nhân được thành lập ở nước ngoài và
                          hoạt động hợp pháp tại Việt Nam. b) Cá nhân có quốc tịch Việt Nam, cá nhân có quốc tịch nước ngoài.

     363              B.  a) Pháp nhân được thành lập tại Việt Nam, pháp nhân được thành lập ở nước ngoài. b) Cá nhân có
                          quốc tịch Việt Nam, cá nhân có quốc tịch nước ngoài.

                      C.  a) Pháp nhân; b) Tổ chức không có tư cách pháp nhân; c) Cá nhân

                      D.  Tất cả các đáp án trên đều sai

            08.001 - Chi nhánh được phát hành bảo lãnh đối với khách hàng cá nhân người không cư trú hay không?

                      A.  Có. Nếu khách hàng ký quỹ đủ 100% giá trị bảo lãnh

     364              B.  Có. Nếu bên nhận bảo lãnh là người cư trú

                      C.  Có. Nếu khách hàng đáp ứng những điều kiện dưới đây: a) Khách hàng ký quỹ đủ 100% giá trị bảo lãnh
                          b) Bên nhận bảo lãnh là người cư trú

                      D.  Không được cấp bảo lãnh đối với khách hàng cá nhân là người không cư trú.

     365    09.020 - Theo Anh/Chị, đơn vị nào có trách nhiệm triển khai Tự đánh giá rủi ro và các chốt kiểm soát (RCSA)

            trong nghiệp vụ Ngân hàng bán lẻ?

                      A.  Các chi nhánh trực tiếp thực hiện quy trình cung cấp sản phẩm bán lẻ tới khách hàng.

                      B.  Các đơn vị có chức năng đầu mối quản lý chính sách, sản phẩm bán lẻ tại Trụ sở chính (Phòng
                          PTSPBL, Phòng PTKS&ĐT).

                      C.  Các đơn vị chức năng khác có liên quan trong quy trình cung cấp sản phẩm bán lẻ (P.CSKHBL,
                          P.QLKCN, P.MKTBL, TTCNTT, P.CSTCKT…).

                      D.  Tất cả các đáp án trên.

            09.019 - Theo Quy trình Tự đánh giá rủi ro và các chốt kiểm soát tại VCB, đơn vị nào chịu trách nhiệm thực
             hiện biện pháp kiểm soát rủi ro cho các rủi ro được nhận diện và đánh giá tại RCSA hoạt động/nghiệp vụ?

                      A.  Các đơn vị có chức năng đầu mối quản lý chính sách, sản phẩm, hoạt động, nghiệp vụ tại Trụ sở chính.

     366              B.  Các chi nhánh trực tiếp tham gia vào quy trình thực hiện hoạt động/nghiệp vụ.

                      C.  Tất cả các đơn vị có liên quan đều có trách nhiệm thực hiện biện pháp kiểm soát rủi ro trong phạm vi
                          chức năng, nhiệm vụ của đơn vị mình.

                      D.  Phòng QLRRHĐ tại Trụ sở chính.

            09.017 - Câu nào sau đây mô tả không đúng về mục đích thực hiện Tự đánh giá rủi ro và các chốt kiểm soát
            (RCSA) tại VCB?

                      A.  Xác định và đánh giá các rủi ro tiềm ẩn, đánh giá hiệu quả của các chốt kiểm soát, đánh giá các rủi ro
                          còn lại, từ đó đề xuất cải tiến hoặc bổ sung những biện pháp kiểm soát rủi ro thích hợp nhằm phòng
                          ngừa và giảm thiểu rủi ro hoạt động phát sinh.

     367              B.  Nâng cao nhận thức về rủi ro hoạt động và QLRRHĐ cho các đơn vị, bộ phận nghiệp vụ, tăng cường
                          văn hóa QLRRHĐ.

                      C.  Tập trung vào rà soát, nhận diện các rủi ro tiềm ẩn chưa từng xảy ra tại VCB nhưng có thể xảy ra trong
                          thời gian tới để xây dựng kế hoạch chủ động đối phó khi rủi ro xảy ra.

                      D.  Xây dựng báo cáo về hồ sơ rủi ro của VCB/đơn vị, nâng cao sự nhận biết và đảm bảo các rủi ro tiềm ẩn
                          được xem xét và có biện pháp kiểm soát rủi ro phù hợp.

            09.016 - Trường hợp phát hiện trang Website hoặc Trang Mạng xã hội đăng tải các bài viết chào mời người
            dân mở tài khoản thanh toán, đăng ký DVNHĐT hoặc phát hành thẻ tại VCB rồi cung cấp thông tin cho bên
            thứ ba để sử dụng. Anh/chị sẽ cần thực hiện theo phương án nào sau đây?

                      A.  Không cần thực hiện gì cả vì không liên quan cá nhân mình
     368
                      B.  Truy cập vào trang giả mạo để đăng tải các bình luận đe dọa người đăng đang vi phạm pháp luật.

                      C.  Cán bộ thu thập thông tin, hình ảnh các vi phạm và thực hiện báo cáo vụ việc tới P.QLRRHĐ để nắm bắt
                          và xử lý sự cố theo quy định.

                      D.  Tất cả các phương án trên đều đúng

            09.010 - Theo Quy định ứng xử và đạo đức nghề nghiệp của cán bộ nhân viên VCB, trường hợp nào sau đây
             bị coi là vi phạm?

                      A.  CBNV thực hiện công việc làm thêm ngoài giờ hành chính và không làm ảnh hưởng tới công việc tại
                          VCB
     369
                      B.  CBNV và người có liên quan cùng thực hiện nhiệm vụ dẫn tới giao dịch có xung đột lợi ích với VCB

                      C.  CBNV làm công tác khách hàng, thẩm định và phê duyệt tín dụng nhận hộ, trả nợ thay tiền vay của
                          khách hàng

                      D.  B&C

            09.027 - Theo Chính sách quản lý rủi ro gian lận của VCB, hành vi gian lận là gì?

                      A.  Là hành vi cố ý lừa đảo, chiếm đoạt tài sản của ngân hàng của cán bộ ngân hàng

                      B.  Là hành vi cố ý vi phạm các quy định của pháp luật và/hoặc quy định nội bộ của ngân hàng của cán bộ
     370                  ngân hàng và/hoặc đối tượng bên ngoài.

                      C.  Là hành vi cố ý lừa đảo, chiếm đoạt tài sản của ngân hàng và/hoặc của khách hàng tại Ngân hàng, hoặc
                          cố ý vi phạm các quy định của pháp luật và/hoặc quy định nội bộ của Ngân hàng của cán bộ Ngân hàng
                          và/hoặc đối tượng bên ngoài.

                      D.  Là gian lận nội bộ và gian lận bên ngoài.

     371    09.008 - Theo anh chị, tình huống nào cần thực hiện báo cáo theo Quy định ứng xử và đạo đức nghề nghiệp

            của cán bộ nhân viên VCB?


                      A.  Cán bộ Phòng Dịch vụ Khách hàng biết hoặc nghi ngờ hành vi vi phạm Quy định ứng xử và đạo đức
                          nghề nghiệp của Trưởng Phòng phải thực hiện báo cáo Ban Giám đốc Chi nhánh hoặc báo cáo Phòng
                          QLRRHĐ TSC hoặc báo cáo qua Hòm thư tố giác trên website của VCB.

                      B.  Chuyên viên dịch vụ khách hàng CFA tại Phòng giao dịch bị Trưởng Phòng PGD chỉ đạo thực hiện công
                          việc vi phạm quy định pháp luật, quy định nội bộ của VCB báo cáo tới Phòng QLRRHĐ TSC hoặc báo
                          cáo TSC thông qua Hòm thư tố giác của VCB.

                      C.  Phó trưởng Phòng Kinh doanh dịch vụ tại Chi nhánh báo cáo TSC thông qua bộ phận Nhân sự tại
                          CN/TSC về người có liên quan của cán bộ và các đối tượng cá nhân có mối quan hệ tiềm ẩn rủi ro khác
                          theo quy định của VCB trong từng thời kỳ công tác tại cùng đơn vị.

                      D.  Tất cả các trường hợp trên

            09.006 - Theo Quy định ứng xử và đạo đức nghề nghiệp của CBNV VCB, cán bộ tham gia công tác đào tạo,
            diễn thuyết sử dụng chức danh tại VCB cho một tổ chức bên ngoài thì phải thực hiện như thế nào?

                      A.  Báo cáo cấp lãnh đạo trực tiếp

     372              B.  Tuân thủ quy định về sử dụng và bảo mật thông tin

                      C.  Đảm bảo công việc này không gây ra xung đột lợi ích với VCB, không gây ảnh hưởng đến việc hoàn
                          thành nhiệm vụ tại VCB

                      D.  CBNV phải thực hiện tất cả các công việc trên

            09.005 - Quy định ứng xử và đạo đức nghề nghiệp của CBNV VCB quy định CBNV phải ứng xử như thế nào
            đối với các thông tin chưa được kiểm chứng, thông tin không dẫn chiếu nguồn gốc rõ ràng, hợp pháp về
             Ngân hàng, lãnh đạo, cán bộ hoặc khách hàng liên quan đến các giao dịch thực hiện với VCB?

                      A.  CBNV được công khai bình luận đối với các thông tin chưa được kiểm chứng, thông tin không dẫn chiếu
                          nguồn gốc rõ ràng, hợp pháp về Ngân hàng, lãnh đạo, cán bộ hoặc khách hàng liên quan đến các giao
                          dịch thực hiện với VCB. Tuyệt đối không được phát tán thông tin sai lệch, thiếu chính xác và mang tính
                          chủ quan cá nhân về Ngân hàng, lãnh đạo, cán bộ của VCB hoặc khách hàng liên quan đến các giao
                          dịch thực hiện với VCB gây tổn hại đến thương hiệu, uy tín của Ngân hàng, lãnh đạo, cán bộ hoặc
                          khách hàng.

                      B.  CBNV không nên công khai bình luận đối với các thông tin chưa được kiểm chứng, thông tin không dẫn
     373                  chiếu nguồn gốc rõ ràng, hợp pháp về Ngân hàng, lãnh đạo, cán bộ hoặc khách hàng liên quan đến các
                          giao dịch thực hiện với VCB. Hạn chế phát tán thông tin sai lệch, thiếu chính xác và mang tính chủ quan
                          cá nhân về Ngân hàng, lãnh đạo, cán bộ của VCB hoặc khách hàng liên quan đến các giao dịch thực
                          hiện với VCB gây tổn hại đến thương hiệu, uy tín của Ngân hàng, lãnh đạo, cán bộ hoặc khách hàng.

                      C.  CBNV không được công khai bình luận đối với các thông tin chưa được kiểm chứng, thông tin không
                          dẫn chiếu nguồn gốc rõ ràng, hợp pháp về Ngân hàng, lãnh đạo, cán bộ hoặc khách hàng liên quan đến
                          các giao dịch thực hiện với VCB. Tuyệt đối không được phát tán thông tin sai lệch, thiếu chính xác và
                          mang tính chủ quan cá nhân về Ngân hàng, lãnh đạo, cán bộ của VCB hoặc khách hàng liên quan đến
                          các giao dịch thực hiện với VCB gây tổn hại đến thương hiệu, uy tín của Ngân hàng, lãnh đạo, cán bộ
                          hoặc khách hàng.

                      D.  Không có đáp án nào đúng

            09.030 - Theo Quy trình Quản lý rủi ro gian lận của VCB, trường hợp cán bộ P.DVKH phát hiện cán bộ Phòng
             Khách hàng cố ý vi phạm quy định mở tài khoản nhằm đạt được lợi ích cá nhân, cán bộ P.DVKH cần làm gì?

                      A.  Báo cáo Phòng Quản lý rủi ro hoạt động TSC hoặc Ban Kiểm tra Nội bộ
     374
                      B.  Báo cáo cấp lãnh đạo trực tiếp

                      C.  Báo cáo qua Hòm thư tố giác trên website của VCB

                      D.  Cả 3 đáp án trên đều đúng

     375    09.004 - Quy định ứng xử và đạo đức nghề nghiệp của cán bộ nhân viên VCB quy định cán bộ cần xây dựng

            tính cẩn trọng như thế nào?

                      A.  - Trong quá trình làm việc, CBNV phải cẩn thận, kỹ lưỡng, lường đoán rủi ro; chủ quan, dễ dãi, bỏ qua
                          các bước trong quy trình;

                      B.  - Trong quá trình làm việc, CBNV phải cẩn thận, kỹ lưỡng, lường đoán rủi ro; không chủ quan, dễ dãi,
                          làm tắt bỏ qua các bước trong quy trình; để xảy ra sai sót, sơ suất trong công việc

                      C.  - Trong quá trình làm việc, CBNV phải cẩn thận, kỹ lưỡng, cân nhắc thấu đáo và lường đoán rủi ro để
                          phòng ngừa; tự giác chịu sự giám sát, kiểm soát theo quy định; - CBNV không được chủ quan, liều lĩnh
                          dễ dãi, cả tin; không làm tắt, bỏ qua các bước, các thủ tục trong quy trình nghiệp vụ; - CBNV phải đề cao
                          tinh thần tự chịu trách nhiệm, tránh để xảy ra sai sót, sơ suất trong công việc

                      D.  - Trong quá trình làm việc, CBNV phải cẩn thận, kỹ lưỡng, lường đoán rủi ro; không chủ quan, dễ dãi, bỏ
                          qua các bước trong quy trình; đề cao tinh thần tự chịu trách nhiệm;

            09.002 - Câu nào là mô tả đúng nhất về đối tượng phải tuân thủ Quy định ứng xử và đạo đức nghề nghiệp
            của cán bộ nhân viên VCB?

                      A.  Các cán bộ nhân viên và cán bộ quản lý làm công tác bán lẻ tại Chi nhánh và TSC

                      B.  Các cán bộ nhân viên và cán bộ quản lý thực hiện hoạt động kinh doanh, hoạt động tác nghiệp và hỗ trợ
                          tại Chi nhánh và TSC
     376
                      C.  Toàn thể cán bộ nhân viên làm việc tại VCB, bao gồm TSC, Chi nhánh, Văn phòng đại diện, Đơn vị sự
                          nghiệp, cán bộ nhân viên do VCB cử đi làm việc tại các đơn vị thành viên, không phân biệt loại và hình
                          thức hợp đồng lao động, hợp đồng dịch vụ, kể cả trong thời gian thử việc, học việc

                      D.  Toàn thể cán bộ nhân viên đã ký Hợp đồng lao động chính thức không xác định thời hạn làm việc tại
                          VCB (bao gồm TSC và chi nhánh)

            09.001 - Đáp án nào chính xác nhất về mục đích ban hành của Quy định ứng xử và đạo đức nghề nghiệp của
            CBNV VCB?

                      A.  Nâng cao tính chuyên nghiệp, uy tín của VCB và của CBNV VCB
     377
                      B.  Hạn chế và ngăn ngừa rủi ro đạo đức có thể gây ra cho VCB

                      C.  Nâng cao tính chuyên nghiệp, uy tín của VCB

                      D.  Cả A và B

            04.033 - Các nhóm SPDV cho phép gắn mã cán bộ bán hàng SellerID và mã người giới thiệu ReferID theo CV
            số 10394 ngày 01/08/2023 là gì?

                      A.  HĐV và Tín dụng

     378              B.  CIF và NHĐT

                      C.  Các giao dịch đăng ký tự động trích nợ tài khoản thanh toán hóa đơn dịch vụ viễn thông, tiền điện, tiền
                          nước…

                      D.  Tất cả các sản phẩm dịch vụ trên

            08.027 - Khách hàng X hoạt động trong lĩnh vực SX đồ uống, bộ phận thẩm định đề xuất giữ nguyên giới hạn
            tín dụng cho KH như kỳ trước, tuy nhiên KH không thuộc đối tượng được định hướng duy trì do XHTD PD ở
             mức cc+, không đáp ứng tiêu chí XHTD ccc. Trong trường hợp này, khi thực hiện thẩm định và đề xuất
            GHTD, bộ phận thẩm định cần:

                      A.  Không được phép giữ nguyên GHTD, Thực hiện giảm GHTD do không đáp ứng tiêu chí của Nhóm
     379
                          khách hàng có định hướng tín dụng Duy trì

                      B.  Đánh giá khả năng khách hàng có thể cải thiện XHTD PD lên ccc trong tương lai

                      C.  Đánh giá các biện pháp kiểm soát nhằm hạn chế, giảm thiểu rủi ro đối với khách hàng

                      D.  Cả đáp án B và C đều đúng

            04.029 - Đâu là hành vi CSA KHÔNG nên làm?

                      A.  Lắng nghe và hỗ trợ nhu cầu của khách hàng

     380              B.  Đặt câu hỏi để tìm hiểu thêm nhu cầu của khách hàng

                      C.  Hỏi quá nhiều thông tin riêng tư của KH không thực sự cần thiết cho quá trình giao dịch, tư vấn

                      D.  Cảm ơn và hỏi lý do khách hàng từ chối sản phẩm (nếu có)

            04.025 - Sản phẩm nào có thể được mua trên kênh Digi (VCB Digi App và website VCB)?

                      A.  FWD Đón đầu thay đổi 3.0 (UL 3.0)

     381              B.  FWD Nâng tầm vị thế 2.0 (ILP 2.0)

                      C.  FWD Sống trọn tương lai

                      D.  FWD Phụ nữ hiện đại

     382    04.039 - Số lượng KH Priority được phân giao tối đã cho 01 RM Priority là bao nhiều để đảm bảo công việc

            chăm sóc KH được tốt nhất?

                      A.  100 KH/RM Priority

                      B.  150 KH/RM Priority

                      C.  200 KH/RM Priority

                      D.  250 KH/RM Priority

            04.020 - Ai sẽ là người nhập thông tin vào hệ thống bán hàng Lead Tracking System (LTS)

                      A.  Lãnh đạo phòng

     383              B.  CBBH trực tiếp

                      C.  CB giới thiệu

                      D.  FSC (Chuyên viên tư vấn tài chính của FWD)

            04.015 - KH có thể thực hiện thu thập sinh trắc học qua các kênh nào?

                      A.  Thu thập online trên VCB Digibank (định danh bằng CCCD) -Ứng dụng công nghệ NFC để đọc dữ liệu
                          từ CCCD gắn chip, đối chiếu ảnh chụp khuôn mặt KH với ảnh trong con chip của CCCD

     384              B.  Thu thập online trên VCB Digibank (định danh bằng tài khoản VNeID)- Giải pháp kiểm tra khớp đúng
                          thông tin, dữ liệu khuôn mặt của KH với tài khoản VNeID cấp độ 2 của KH

                      C.  Thu thập tại Điểm giao dịch VCB

                      D.  Cả 3 đáp án trên

            04.005 - Kinh nghiệm tăng tỉ lệ thâm nhập VCB Digibank trên nhóm KH mới tại quầy?

                      A.  Giới thiệu và bán VCB Digibank khi KH tới quầy giao dịch

     385              B.  Hướng dẫn KH active VCB Digibank ngay tại quầy

                      C.  Truy xuất dữ liệu KH đã đăng ký nhưng chưa kích hoạt dịch vụ qua các hệ thống: backend Digibank
                          hoặc Portal Report

                      D.  Cả 3 đáp án trên

            04.040 - CN có được phân giao KH Priority cho RM SME chăm sóc không?

                      A.  Không được phân giao cho RM SME

     386              B.  Được phân giao cho RM SME

                      C.  Được phân giao cho RM SME nhưng chỉ trong 06 tháng kể từ khi KH được định danh

                      D.  Được phân giao cho RM SME nhưng chỉ trong 03 tháng kể từ khi KH được định danh

            04.004 - Các phương thức xác thực giao dịch trên Ngân hàng số VCB Digibiz

                      A.  - SmartOTP tích hợp, - HardToken nâng cao

                      B.  - SmartOTP tích hợp, - HardToken nâng cao - (MPIN, SMS OTP chỉ áp dụng với 1 phạm vi nhỏ giao dịch
     387                  phi tài chính)

                      C.  -SmartOTP/ FaceID tích hợp, - HardToken nâng cao - (MPIN, SMS OTP chỉ áp dụng với 1 phạm vi nhỏ
                          giao dịch phi tài chính)

                      D.  -SmartOTP/ FaceID tích hợp, - HardToken nâng cao

            04.003 - Hệ thống các chính sách, giải pháp thanh toán QR Code của VCB bao gồm?

                      A.  QR Offline, QR Online

     388              B.  QR UPI, QR Thái Lan

                      C.  QR Billing

                      D.  Cả 3 đáp án trên

     389    04.001 - Các sản phẩm, dịch vụ trên VCB Digibank được ghi nhận doanh số cho CBBH gồm những sản phẩm
             nào?

                      A.  Huy động vốn

                      B.  Thẻ, Vay

                      C.  Đăng ký VCB Digibank eKYC

                      D.  Cả 3 đáp án trên

            06.009 - Hiện tại, VCB đang triển khai dịch vụ đăng ký và thanh toán loại thẻ mang thương hiệu nào trên các
             ứng dụng di động như GoogleWallet/SamsungPay/ApplePay ?

                      A.  Visa
     390
                      B.  Master

                      C.  JCB

                      D.  Tất cả các đáp án trên

            06.008 - Các dịch vụ nào được chấp nhận sử dụng trên ATM của Vietcombank?

                      A.  Rút tiền qua QR (nguồn thẻ và tài khoản)

     391              B.  Thanh toán hóa đơn

                      C.  Chuyển tiền qua thẻ

                      D.  Tất cả các đáp án trên

            06.007 - Hiện nay VCB đang phát hành sản phẩm thẻ tín dụng công ty mang thương hiệu nào?

                      A.  Visa

     392              B.  American Express

                      C.  MasterCard

                      D.  A và B

            06.006 - Hạn mức rút tiền mặt tối đa/1 ngày của thẻ Connect24 Vietcombank là bao nhiêu?

                      A.  100.000.000 VND

     393              B.  200.000.000 VND

                      C.  300.000.000 VND

                      D.  400.000.000VND

            06.010 - Theo quy định hiện hành của VCB, KH có thể thực hiện liên kết tối đa bao nhiêu thẻ trên ứng dụng
            ApplePay ?

                      A.  Tùy thuộc từng dòng máy Apple, số lượng thẻ tối đa có thể liên kết vào ApplePay là 8 thẻ
     394
                      B.  Tùy thuộc từng dòng máy Apple, số lượng thẻ tối đa có thể liên kết vào ApplePay là 12 thẻ

                      C.  Tùy thuộc từng dòng máy Apple, số lượng thẻ tối đa có thể liên kết vào ApplePay là 16 thẻ

                      D.  Không giới hạn số lượng thẻ

            06.005 - Sản phẩm thẻ tín dụng nào sau đây của VCB có tỷ lệ hoàn tiền chi tiêu tại nước ngoài cao nhất?

                      A.  Thẻ MasterCard World

     395              B.  Thẻ JCB Platinum

                      C.  Thẻ Visa Platinum

                      D.  Thẻ Vietnam Airlines Platinum American Express

            06.002 - Các nguyên tắc đảm bảo an toàn khi giao dịch trực tuyến trên các kênh điện tử?

                      A.  Tuyệt đối không tiết lộ thông tin định danh cá nhân (tên đăng nhập, mật khẩu và mã khóa bí mật dùng
                          một lần - OTP) cho bất cứ ai khác.

     396              B.  Tuyệt đối không tải và sử dụng các ứng dụng không rõ nguồn gốc (chỉ sử dụng ứng dụng đã được kiểm
                          định rõ ràng trên chợ ứng dụng App Store và Google Play Store)

                      C.  Không nên sử dụng các thông tin cá nhân cơ bản (ngày sinh, số điện thoại, tên,…) để đặt mật khẩu

                      D.  Tất cả các đáp án trên

     397    06.001 - Theo quy định hiện hành của VCB, chủ thẻ được phép thực hiện các giao dịch nào sau đây?


                       A.   Cho thuê, cho mượn thẻ hoặc thông tin thẻ, mở hộ thẻ, thuê, cho thuê, mượn, cho mượn Ví điện tử
                            hoặc mua, bán thông tin Ví điện tử…

                       B.  Sử dụng hoặc tạo điều kiện cho các đối tượng sử dụng tài khoản thanh toán, thẻ ngân hàng, Ví điện tử
                           vào mục đích vi phạm pháp luật.

                       C.  Thực hiện giao dịch rút tiền mặt tại ĐVCNT

                       D.  Thanh toán hàng hóa, dịch vụ tại ĐVCNT hoặc nạp/rút tiền tại máy ATM.

             07.029 - Thời gian giao dịch PGD A được quy định là kết thúc lúc 16h00. Như vậy cán bộ nhân viên tại khu
             vực giao dịch cần thực hiện thế nào cho phù hợp?

                       A.   Ngừng tiếp nhận KH mới bước vào Điểm giao dịch sau 16h và có biển thông báo về giờ giao dịch cho
                            KH. Trường hợp Điểm giao dịch vẫn hỗ trợ khách hàng thì cần giải thích về thời gian phục vụ và nội
                           dung hỗ trợ (nếu có).

     398               B.  Tiếp nhận và xử lý giao dịch cho khách hàng bước vào điểm giao dịch sau 16h00 nếu khách hàng vẫn
                           có nhu cầu giao dịch

                       C.  Tiếp nhận yêu cầu giao dịch của khách hàng mới bước vào điểm giao dịch sau 16h00 nếu khách hàng
                           vẫn có nhu cầu giao dịch. Tuy nhiên báo với KH giao dịch sẽ được thực hiện vào giờ giao dịch của ngày
                            hôm sau.

                       D.   Ngừng tiếp nhận KH từ khoảng 15h30 - 15h45 để đảm bảo đến 16h00 tất cả giao dịch của KH đã hoàn
                           tất

             07.031 - Trường hợp giao dịch có hẹn ngày trả kết quả/ trả thẻ hoặc thời gian hoàn tất giao dịch của khách
             hàng là thời điểm tương lai thì cán bộ gian dịch cần ưu tiên làm công việc gì trước?

                       A.  Thông báo cho KH về việc giao dịch sẽ được thực hiện và Cung cấp số điện thoại của cán bộ để KH liên
                            hệ khi đến hạn xử lý.
     399
                       B.   Cung cấp cho KH giấy hẹn theo quy định (nếu có)

                       C.   Cung cấp cho KH giấy hẹn theo quy định và/ hoặc cung cấp cho KH thông tin về thời gian hoàn tất giao
                           dịch của KH hoặc thời gian sẽ thông báo cho KH kết quả giao dịch

                       D.   Cả ba đáp án trên

             07.028 - Khi đang tiếp KH, cán bộ cần sử dụng điện thoại hoặc rời quầy giao dịch thì phương án nào sau đây
             là phù hợp nhất?

                       A.  A. Nếu phải rời quầy giao dịch để phục vụ giao dịch của chính khách hàng thì phải thông báo tới khách
                            hàng; Trường hợp KH biết cán bộ sử dụng điện thoại để xử lý giao dịch cho khách hàng thì không cần
                           thông báo cho KH.

     400               B.   B. Nếu phải nghe điện thoại hoặc rời quầy giao dịch thì phải xin lỗi khách hàng và được khách hàng
                           đồng ý. Không rời quầy để khách hàng đợi hoặc gián đoạn giao dịch quá 3 phút mà không cho khách
                            hàng biết lý do/ xin lỗi khách hàng.

                       C.   C. Không rời quầy để khách hàng đợi hoặc gián đoạn giao dịch quá 15 phút mà không cho khách hàng
                            biết lý do/ xin lỗi khách hàng

                       D.   D. A&B

             07.027 - Khi VCB đang triển khai chương trình khuyến mại có liên quan đến sản phẩm KH đang sử dụng, cán
             bộ giao dịch cần làm gì?

                       A.  A. Chủ động giới thiệu, truyền thông với khách hàng các chương trình khuyến mại đang triển khai của
                           Vietcombank
     401
                       B.   B. Đưa tờ rơi giới thiệu chương trình khuyến mại cho khách hàng (nếu có)

                       C.   C. Đề nghị KH qua quầy lễ tân hoặc tư vấn để được tư vấn về chương trình khuyến mại

                       D.   D. A&B

             07.025 - Đối tượng nào phải tuân thủ Quy định Bộ tiêu chuẩn chất lượng phục vụ KH tại Điểm giao dịch

                       A.   Cán bộ giao dịch, nhân viên lễ tân, Nhân viên bảo vệ, nhân viên an ninh, Cán bộ tư vấn sản phẩm tại
                           sảnh giao dịch.
     402
                       B.  Tất cả các cán bộ làm việc tại Điểm giao dịch.

                       C.   Cán bộ giao dịch, nhân viên lễ tân, nhân viên bảo vệ, nhân viên an ninh.

                       D.   Cán bộ giao dịch

            07.032 - Trường hợp giao dịch của KH tại quầy có thể kéo dài quá 15 phút, theo quy định, cán bộ giao dịch
            cần làm gì?

                      A.  A. Thông báo cho KH về thời gian dự kiến thực hiện yêu cầu của KH.

     403              B.  B. Đề nghị KH chờ tại khu vực chờ trong thời gian thực hiện giao dịch

                      C.  C. Không có quy định cụ thể đối với nội dung này. Giao dịch viên xử lý tùy từng trường hợp, khéo léo để
                          KH không phàn nàn

                      D.  D. A&B

            07.023 - Cán bộ giao dịch cần xử lý như thế nào đối với các trường hợp có KH Priority hoặc KH cần xử lý
            giao dịch gấp chen ngang?

                      A.  Cán bộ giao dịch có thể chuyển KH hiện tại sang quầy khác hoặc tạm ngừng giao dịch với KH hiện tại
                          để tiếp KH ưu tiên trước.
     404
                      B.  Không xử lý chen ngang các giao dịch của KH hiện tại.

                      C.  Không ưu tiên xử lý chen ngang KH hiện tại. Trường hợp cần thiết phải xử lý thì phải khéo léo xin lỗi
                          khách hàng đang giao dịch/đang chờ giao dịch và chỉ ưu tiên khách hàng đến sau nếu được khách hàng
                          đang giao dịch/đang chờ giao dịch đồng ý

            07.021 - Cán bộ giao dịch cần chào đón KH như thế nào?

                      A.  A. Chủ động mỉm cười, nhìn về phía khách hàng, chào khách hàng khi khách hàng vào quầy giao dịch
                          với giọng nói rõ ràng

     405              B.  B. Mỉm cười hoặc chào KH khi KH vào giao dịch

                      C.  C.Cán bộ giao dịch phải chào đón khi quầy vắng khách. Trường hợp quầy đông thì xử lý linh hoạt nhưng
                          vẫn phải đảm bảo lịch sự

                      D.  A&C

            07.020 - Khi thực hiện xong giao dịch cho khách hàng, cán bộ giao dịch cần làm gì:

                      A.  Thông báo khi kết thúc giao dịch

     406              B.  Cảm ơn, chào/ hẹn gặp lại khách hàng khi kết thúc giao dịch.

                      C.  Hỏi thêm nhu cầu của khách hàng khi kết thúc giao dịch để đảm bảo khách hàng đã được giải quyết hết
                          các yêu cầu.

                      D.  Cả ba phương án trên

            07.019 - Cán bộ giao dịch tại ĐGD chưa được cấp phát thẻ tên thì phải làm gì:

                      A.  Đeo thẻ tạm theo mẫu quy định

     407              B.  Không có quy định cụ thể. Tuy nhiên khuyến khích cán bộ giao dịch chuẩn bị thẻ tạm

                      C.  Thực hiện theo quy định tại Điểm giao dịch mà cán bộ đang công tác.

                      D.  Thực hiện theo quy định tại Chi nhánh mà cán bộ đang công tác.

            07.033 - Trường hợp không thể giữ đúng lời hẹn với KH (trong các trường hợp giao dịch bất thường, giao
            dịch lỗi, thời gian trả thẻ không chính xác…) thì cán bộ giao dịch cần làm gì?

                      A.  Chủ động cho khách hàng biết nguyên nhân (nếu phù hợp), xin lỗi khách hàng và thông báo về thời gian
                          sẽ xử lý cho khách hàng
     408
                      B.  Xin lỗi KH trong trường hợp KH phàn nàn nhưng không cần thiết phải nêu nguyên nhân

                      C.  Xin lỗi KH trong trường hợp KH phàn nàn nhưng không cần thiết phải nêu nguyên nhân và thông báo về
                          thời gian sẽ xử lý cho khách hàng

                      D.  Thông báo cập nhật cho KH về thời gian sẽ xử lý.

     409    07.018 - Cán bộ giao dịch tại quầy thực hiện nhiệm vụ giới thiệu, bán thêm/ bán chéo sản phẩm cho KH như

            thế nào?

                      A.  A. Bán thêm/ bán chéo chỉ thực hiện khi KH đã phát sinh nhu cầu

                      B.  B. Gợi mở, tìm hiểu thêm nhu cầu của khách hàng để giới thiệu sản phẩm dịch vụ hoặc đưa tờ rơi giới
                          thiệu sản phẩm dịch vụ cho khách hàng.

                      C.  C. Khuyến khích đề nghị khách hàng giới thiệu thêm khách hàng khác sử dụng sản phẩm dịch vụ của
                          Vietcombank

                      D.  B&C

            07.017 - Theo quy định của Bộ tiêu chuẩn Chất lượng phục vụ KH, cán bộ giao dịch có được để điện thoại di
            động trên mặt bàn giao dịch không?

     410              A.  Điện thoại di động có thể để trên mặt bàn, quầy nhưng phải để chế độ rung/ chuông nhỏ

                      B.  Không được

                      C.  Có thể để điện thoại di động.

            08.028 - Khách hàng Y đang là SME siêu nhỏ, hoạt động đồng thời trong 02 lĩnh vực sản xuất nguyên vật liệu
            đỗ tương để sản xuất ra thành phẩm và thương mại thành phẩm. Mã ngành cho khách hàng được xác định
            theo nguyên tắc nào?

                      A.  Mã ngành của khách hàng là ngành hoạt động kinh doanh chính đem lại doanh thu lớn nhất trong tổng
                          doanh thu hàng năm của KH
     411
                      B.  Mã ngành của khách hàng là ngành hoạt động chính đem lại >40% doanh thu cho khách hàng

                      C.  Trường hợp cấp tín dụng cho khách hàng theo sản phẩm cụ thể, xác định theo quy định tại sản phẩm.
                          Trường hợp khác, xác định theo hoạt động kinh doanh chính đem lại doanh thu lớn nhất trong tổng
                          doanh thu hàng năm của KH

                      D.  Không có đáp án nào đúng

            07.015 - Thông báo tại điểm giao dịch là thời gian làm việc từ 8h00 - 16h00. Như vậy vào thời điểm 8h00 tại
            ĐGD, cán bộ giao dịch cần phải?

                      A.  Bắt đầu mở cửa PGD
     412
                      B.  Có mặt tại CN/ PGD

                      C.  Đã có mặt tại bàn quầy và sẵn sàng đón tiếp KH

            07.034 - Bộ tiêu chuẩn chất lượng phục vụ KH tại điểm giao dịch của VCB quy định những nội dung gì?

                      A.  1. Tiêu chuẩn đối với tất cả các cán bộ nhân viên tại điểm giao dịch 2. Tiêu chuẩn chất lượng điểm giao
                          dịch, ATM/RATM.

                      B.  1. Tiêu chuẩn đối với cán bộ phục vụ khách hàng tại điểm giao dịch 2. Tiêu chuẩn chất lượng điểm giao
                          dịch gồm khu vực bên ngoài ĐGD; bên trong sảnh GD; Khu vực quầy giao dịch
     413
                      C.  1. Tiêu chuẩn đối với cán bộ phục vụ khách hàng tại điểm giao dịch 2. Tiêu chuẩn chất lượng điểm giao
                          dịch, ATM/RATM

                      D.  1. Tiêu chuẩn đối với các cán bộ nhân viên tại điểm giao dịch gồm: CBGD, Nhân viên lễ tân; Điều phối
                          viên tại điểm giao dịch; Nhân viên bảo vệ, nhân viên an ninh; Cán bộ tư vấn sản phẩm tại sảnh giao
                          dịch; Cán bộ tiếp nhận và xử lý cuộc gọi đến của khách hàng. 2. Tiêu chuẩn chất lượng điểm giao dịch
                          gồm khu vực bên ngoài ĐGD; bên trong sảnh GD; Khu vực quầy giao dịch

            07.014 - Cán bộ nhân viên trong khu vực giao dịch mà không phải giao dịch viên thì có cần tuân thủ quy định
            về trang phục không?

     414              A.  Tùy thuộc vào quy định của từng chi nhánh

                      B.  Không. Không có quy định về trang phục đối với cán bộ không phải giao dịch viên

                      C.  Có. Phải mặc đồng phục hoặc trang phục đảm bảo lịch sự, đúng quy định.

            07.012 - Cách thức đo lường mức độ hài lòng của khách hàng áp dụng tại Vietcombank trong năm 2024 đối
            với kênh quầy, kênh tự phục vụ (RATM/ATM), kênh ngân hàng điện tử là:

                      A.  Khảo sát khách hàng qua mã QR tại quầy / máy ATM, R-ATM
     415
                      B.  Khảo sát khách hàng qua tin OTT gửi cho khách hàng sau giao dịch

                      C.  Khảo sát khách hàng qua pop-up các kênh ngân hàng điện tử ngay sau giao dịch

                      D.  Tất cả các đáp án trên

     416    07.010 - Trong Bộ chỉ tiêu KPI năm 2024, cơ cấu điểm KPI chất lượng dịch vụ giao cho chi nhánh năm 2024

            gồm các chỉ số nào?

                      A.  Điểm chất lượng dịch vụ kênh quầy (80%) và điểm chất lượng dịch vụ kênh tự phục vụ (20%)

                      B.  Điểm chất lượng dịch vụ kênh quầy gồm 3 chỉ số: CSAT, NPS, Tỷ lệ giao dịch đạt chuẩn về thời gian
                          chờ giao dịch tại quầy

                      C.  Điểm chất lượng dịch vụ kênh tự phục vụ gồm 2 chỉ số: CSAT, NPS

                      D.  Tất cả các đáp án trên

            02.137 - Trường hợp nào không đáp ứng điều kiện vay vốn theo sản phẩm cho vay tín chấp đối với Người
             lao động (theo QĐ 99/QĐ-VCB-PTSPBL ngày 01/02/2023 và các văn bản sửa đổi, bổ sung)

                      A.  KH có thu nhập từ lương 10 triệu đồng/tháng

     417              B.  Khách hàng đang có khoản vay tín chấp số tiền 100 triệu đồng tại ngân hàng BIDV tại thời điểm đề nghị
                          vay vốn

                      C.  Khách hàng không có khoản vay tín chấp nào tại thời điểm đề nghị vay vốn nhưng có 1 thẻ tín dụng tín
                          chấp hạn mức 30 triệu đồng tại ngân hàng HSBC

                      D.  Khách hàng đã ký HĐLĐ không xác định thời hạn

            02.136 - Tháng 06/2024, Khách hàng A đề nghị vay từng lần theo Sản phẩm cho vay tín chấp đối với Người
             lao động. Đâu là điều kiện về điểm xếp hạng tín dụng nội bộ (XHTDNB) của Khách hàng A tại thời điểm chi
             nhánh thẩm định và đề xuất cho vay? (Khách hàng A không phải đối tương Hạn chế cấp tín dụng theo quy
            định của VCB)

                      A.  Điểm XHTDNB của Khách hàng A theo hệ thống XHTDNB dựa trên xác suất vỡ nợ (PD) - mô hình thẻ
                          điểm hồ sơ (Ascore) nhóm sản phẩm cho vay tiêu dùng không có tài sản bảo đảm của VCB từ AU3 trở
     418
                          lên

                      B.  Điểm XHTDNB của Khách hàng A theo hệ thống XHTDNB - CR cá nhân của VCB từ AU3 trở lên

                      C.  Điểm XHTDNB của Khách hàng A theo hệ thống XHTDNB - CR cá nhân của VCB từ A trở lên

                      D.  Điểm XHTDNB của Khách hàng A theo hệ thống XHTDNB dựa trên xác suất vỡ nợ (PD) - mô hình thẻ
                          điểm hồ sơ (Ascore) nhóm sản phẩm cho vay tiêu dùng không có tài sản bảo đảm của VCB từ A trở lên

            02.134 - Cán bộ thẩm định (CA) tại Phòng giao dịch, Phòng khách hàng không được thẩm định hồ sơ phát
             hành thẻ tín dụng của khách hàng bán lẻ nào sau đây?

                      A.  Khách hàng phát hành thẻ theo hệ thống chấm điểm Xếp hạng tín dụng nội bộ
     419
                      B.  Khách hàng phát hành thẻ tín dụng công ty

                      C.  Khách hàng phát hành thẻ theo chính sách bán kèm khoản vay

                      D.  CA có thể thẩm định tất cả các hồ sơ phát hành thẻ trên

            02.138 - Khách hàng thuộc nhóm đối tượng nào sau đây sẽ không cần chấm điểm theo hệ thống chấm điểm
            Xếp hạng tín dụng nội bộ khi phát hành thẻ tín dụng?

                      A.  Cá nhân đang công tác tại các doanh nghiệp có vốn đầu tư từ các nước thuộc khối OECD
     420
                      B.  Cá nhân đang công tác tại các Doanh nghiệp Nhà nước được xếp hạng đặc biệt

                      C.  Cá nhân là chủ các doanh nghiệp tư nhân

                      D.  Lãnh đạo cấp phòng tại công ty con trực thuộc VCB

            02.117 - KH SME được VCB cấp Giới hạn tín dụng 10 tỷ trong năm 2024, trong đó Giới hạn tín dụng ngắn hạn
             là 3 tỷ, Giới hạn tín dụng trung dài hạn là 7 tỷ. Tính đến thời điểm tháng 5/2024, thời gian quan hệ tín dụng
            của KH tại VCB được 6 tháng. KH nhu cầu vay Hạn mức thấu chi không tài sản bảo đảm 1 tỷ đồng theo QĐ
            2926/QĐ-VCB-P.PTSPBL ngày 23/11/2023). Hạn mức thấu chi tối đa KH được cấp là bao nhiêu?

                      A.  600 triệu
     421
                      B.  1 tỷ đồng

                      C.  KH không được cấp thấu chi không tài sản bảo đảm do không đủ thời gian quan hệ tín dụng tối thiểu
                          theo quy định sản phẩm

                      D.  2 tỷ đồng

     422    02.116 - Theo sản phẩm cho vay theo hạn mức thấu chi không tài sản bảo đảm dành cho KH SME đang có

            quan hệ tín dụng tại VCB, định kỳ hàng quý KH phải cam kết chuyển dòng tiền về VCB với tỷ lệ như thế nào
            ?

                      A.  110% doanh số thấu chi tại VCB

                      B.  110% doanh số giải ngân các khoản cấp tín dụng ngắn hạn trong kỳ tại VCB

                      C.  110% tổng doanh số giải ngân các khoản cấp tín dụng ngắn hạn trong kỳ và nợ trung dài hạn đến hạn
                          cùng kỳ tại VCB

                      D.  Toàn bộ doanh thu về tài khoản thanh toán tại VCB

            02.115 - KH phải đáp ứng điều kiện về thời gian quan hệ tín dụng tại VCB trong tối thiểu bao lâu tính đến thời
            điểm thẩm định và đề xuất cho vay để được tham gia sản phẩm cho vay theo hạn mức thấu chi không tài sản
             bảo đảm dành cho KH SME đang có quan hệ tín dụng tại VCB ?

                      A.  6 tháng
     423
                      B.  12 tháng

                      C.  24 tháng

                      D.  36 tháng

            02.139 - Đối với việc phát hành thẻ tín dụng cá nhân không có bảo đảm, hạn mức tín dụng chủ thẻ tối đa
            Trưởng phòng giao dịch có thể phê duyệt là bao nhiêu?

                      A.  100 triệu VND
     424
                      B.  200 triệu VND

                      C.  500 triệu VND

                      D.  1 tỷ VND

            02.098 - Khách hàng A là chủ Hộ kinh doanh X có đề nghị vay VCB để phục vụ hoạt động Sản xuất kinh
            doanh của Hộ kinh doanh X theo Sản phẩm Kinh doanh tài lộc với tài sản bảo đảm là BĐS của anh ruột
             khách hàng. Qua kiểm tra thông tin CIC anh trai KH vừa phát sinh nợ nhóm 2 tại TCTD X. Đề nghị vay vốn
            của KH có phù hợp với quy định tại Sản phẩm Kinh doanh tài lộc không?

     425              A.  Không do Bên bảo đảm cũng phải đáp ứng điều kiện nợ quá hạn giống khách hàng

                      B.  Không do Sản phẩm Kinh doah tài lộc không nhận tài sản bảo đảm của anh chị em khách hàng

                      C.  Có do Sản phẩm Kinh doanh tài lộc không quy định điều kiện nợ quá hạn của Bên bảo đảm

                      D.  Có do Sản phẩm Kinh doanh tài lộc cho phép nhận tài sản bảo đảm của anh chị em ruột khách hàng

            02.097 - Mục đích vay vốn nào thỏa mãn điều kiện tại Sản phẩm An tâm kinh doanh?

                      A.  Nâng cấp cơ sở lưu trú du lịch

     426              B.  Đầu tư mái công trình xây dựng để lắp đặt hệ thống điện mặt trời mái nhà

                      C.  Mua đất nông nghiệp

                      D.  Mua sắm ô tô chở hàng phục vụ vận chuyển hàng hóa

            02.096 - Khách hàng đề nghị vay vốn để phục vụ hoạt động kinh doanh ngành nghề nào không đáp ứng quy
            định tại Sản phẩm Kinh doanh tài lộc?

                      A.  Kinh doanh tạp hóa
     427
                      B.  Kinh doanh thực phẩm đồ uống

                      C.  Kinh doanh quần áo

                      D.  Kinh doanh cầm đồ

     428    02.095 - CN đề xuất cho KH vay vay mua dây chuyền máy móc thiết bị để phục vụ sản xuất kinh doanh của
             Hộ kinh doanh theo Sản phẩm An tâm kinh doanh, khách hàng phải bổ sung cam kết gì tại phương án sử
            dụng vốn?

                      A.  Chỉ thực hiện bán, chuyển nhượng, cho, tặng, góp vốn, thế chấp, cầm cố tài sản hình thành từ vốn vay
                          VCB sau khi có sự chấp thuận của VCB bằng văn bản

                      B.  Chỉ thực hiện chuyển nhượng, cho, tặng, góp vốn, thế chấp, cầm cố tài sản hình thành từ vốn vay VCB
                          sau khi có sự chấp thuận của VCB bằng văn bản

                      C.  Chỉ thực hiện bán, chuyển nhượng, cho, tặng, góp vốn tài sản hình thành từ vốn vay VCB sau khi có sự
                          chấp thuận của VCB bằng văn bản

                      D.  Chỉ thực hiện bán, chuyển nhượng, góp vốn, thế chấp, cầm cố tài sản hình thành từ vốn vay VCB sau
                          khi có sự chấp thuận của VCB bằng văn bản

            02.140 - Với trường hợp phát hành thẻ không có tài sản bảo đảm, hạn mức tín dụng chủ thẻ tối đa cấp cho
            Thành viên Hội đồng quản trị, thành viên Ban kiểm soát, Tổng giám đốc, Phó Tổng giám đốc của VCB là bao
             nhiêu?

                      A.  500 triệu VND
     429
                      B.  1 tỷ VND

                      C.  2 tỷ VND

                      D.  Đây là nhóm khách hàng không được cấp hạn mức tín dụng chủ thẻ do thuộc những trường hợp không
                          được cấp tín dụng theo Luật các tổ chức tín dụng

            02.082 - Chi nhánh tiếp nhận hồ sơ vay vốn phục vụ hoạt động Sản xuất kinh doanh của gia đình ông A và bà
             B. Qua trao đổi, khách hàng có nhu cầu vay vốn để thanh toán các chi phí chăm sóc vườn cây vải đang ra
             hoa với nguồn trả nợ từ doanh thu bán vải và hoạt động trồng, chăm sóc cây vải thuộc lĩnh vực không phải
            đăng ký kinh doanh. Ngoài ra, Bà B còn là chủ Doanh nghiệp tư nhân Y chuyên đi thu mua vải trong vùng để
             bán lại sẽ tiếp tục đề nghị vay VCB khi đến mùa thu hoạch vải. Trường hợp nhận được cả 2 đề nghị vay vốn
             này, Chi nhánh cần lưu ý điều gì?

                      A.  Cần lưu ý về chủ thể thực hiện kinh doanh khi vay vốn do quy định tại Khoản 3 Điều 80 Nghị định
                          01/2021/NĐ-CP về đăng ký doanh nghiệp thì cá nhân, thành viên hộ gia đình đăng ký hộ kinh doanh
     430                  không được đồng thời là chủ doanh nghiệp tư nhân

                      B.  Không cần lưu ý gì do việc trồng vải của hộ gia đình khách hàng và việc đi thu mua vải của Doanh
                          nghiệp tư nhân Y là hai chủ thể kinh doanh tách biệt nhau.

                      C.  Không cần lưu ý gì do quy định tại Khoản 3 Điều 80 Nghị định 01/2021/NĐ-CP về đăng ký doanh nghiệp
                          thì cá nhân, thành viên hộ gia đình đăng ký kinh doanh đồng thời có thể là chủ doanh nghiệp tư nhân

                      D.  Không cần lưu ý gì do phương án sử dụng vốn là để chăm sóc vườn cây không liên quan đến thu mua
                          vải nên đề nghị vay vốn của khách hàng là phù hợp.

            02.081 - CN VCB tiếp nhận yêu cầu vay vốn của ông B để phục vụ hoạt động sản xuất kinh doanh Hộ kinh
            doanh X . Giấy chứng nhận hộ kinh doanh X do ông B cung cấp có ghi nhận thông tin của 03 thành viên hộ
            gia đình ông B tham gia thành lập Hộ kinh doanh (bao gồm cả ông B và vợ). Trường hợp sau đây đúng theo
            quy định tại Sản phẩm Kinh doanh tài lộc?

                      A.  Ông B là Khách hàng do là đại diện Hộ kinh doanh thực hiện vay vốn
     431
                      B.  Ông B và vợ là khách hàng do khoản vay hình thành trong thời gian hôn nhân của vợ chồng ông B

                      C.  Ông B và 02 thành viên khác của hộ gia đình cùng là khách hàng vay vốn

                      D.  Ông B và vợ là khách hàng do cả hai vợ chồng là thành viên chính thực hiện kinh doanh của Hộ kinh
                          doanh

            02.080 - CN VCB tiếp nhận yêu cầu vay vốn của ông B để phục vụ hoạt động sản xuất kinh doanh Hộ kinh
            doanh X . Giấy chứng nhận hộ kinh doanh X do ông B cung cấp có ghi nhận thông tin của 2 thành viên là
            ông A (tỷ lệ góp vốn 10%) và ông B (tỷ lệ góp vốn 90%). Trường hợp sau đây đúng theo quy định tại Sản
             phẩm Kinh doanh tài lộc?

                      A.  CN đề nghị cả vợ chồng ông B hoàn thiện các thủ tục và ký hồ sơ vay vốn phục vụ hoạt động Sản xuất
                          kinh doanh của Hộ kinh doanh X do ông B có vốn góp chiếm chủ yếu trong Hộ kinh doanh
     432
                      B.  Chi nhánh đề nghị cả ông A, ông B cùng xác lập ký kết và thực hiện thỏa thuận cho vay ký hồ sơ vay
                          vốn phục vụ hoạt động Sản xuất kinh doanh của Hộ kinh doanh X

                      C.  Chi nhánh thực hiện cho vay theo đề nghị của ông B tương ứng với phần vốn góp của ông B thể hiện
                          trên Giấy chứng nhận đăng ký Hộ kinh doanh X

                      D.  Chi nhánh thực hiện cho vay theo đề nghị của ông B để phục vụ nhu cầu vốn phục vụ hoạt động Sản
                          xuất kinh doanh của Hộ kinh doanh X do ông B chiếm tỷ trọng vốn góp chủ yếu của Hộ kinh doanh X

            02.141 - Cá nhân nào sau đây được phép bảo lãnh để phát hành thẻ tín dụng cho người thân?

                      A.  Cán bộ đã công tác liên tục tại Trung tâm hỗ trợ khách hàng (VCC) với thời gian trên 6 năm

     433              B.  Phó Tổng giám đốc VCB

                      C.  Trưởng phòng tại công ty Chứng khoán Vietcombank

                      D.  Lãnh đạo cấp phòng/ban Trụ sở chính vừa được tuyển dụng vào VCB


             02.079 - Chi nhánh tiếp nhận yêu cầu vay vốn của chủ sở hữu Doanh nghiệp tư nhân (DNTN) X. Chủ sở hữu
             DNTN trực tiếp ký các hồ sơ vay vốn gồm Phương án sử dụng vốn, Hợp đồng tín dụng và các hồ sơ liên
             quan khác nhưng do có kế hoạch đi công tác đột xuất nên đề nghị để vợ chủ DNTN ký Giấy nhận nợ và các
             hồ sơ khác theo văn bản ủy quyền của Chủ DNTN. Hồ sơ tài sản bảo đảm thuộc sở hữu của vợ chồng chủ
             DNTN đã hoàn thiện thủ tục thế chấp, đăng ký giao dịch bảo đảm theo quy định. Đề nghị của khách hàng có
             phù hợp với quy định tại sản phẩm Kinh doanh tài lộc không?

                      A.  Phù hợp do bên được ủy quyền là vợ/chồng của chủ DNTN theo văn bản ủy quyền là phù hợp với quy
     434
                          định.

                      B.  Phù hợp do thủ tục hồ sơ tài sản bảo đảm thuộc sở hữu chung của vợ, chồng chủ DNTN đã hoàn thiện.
                          Chủ DNTN là khách hàng vay vốn thì vợ/chồng cũng là khách hàng vay vốn theo sản phẩm.

                      C.  Phù hợp do vợ/chồng chủ DNTN cũng được coi là khách hàng vay vốn theo sản phẩm.

                      D.  Không phù hợp do chủ DNTN không được ủy quyền cho bên thứ ba ký kết thỏa thuận cho vay và các
                          văn bản liên quan bao gồm Giấy nhận nợ.

             12.005 - Điều nào sau đây vi phạm trách nhiệm bảo vệ tài sản của Vietcombank:

                      A.  Cán bộ VCB phải luôn có ý thức và trách nhiệm cao nhất đối với mọi tài sản của Ngân hàng

     435              B.  Chia sẻ dữ liệu trong máy tính cho bạn bè

                      C.  Chỉ sử dụng tài sản của VCB cho mục đích công việc của Ngân hàng

                      D.  Giao nộp và báo cáo đầy đủ cho Ngân hàng mọi tài sản vô hình và hữu hình phát sinh trong các giao
                          dịch với khách hàng và đối tác trong quá trình làm việc tại VCB

             12.007 - Khi bắt tay, quyền chủ động dành cho:

                      A.  Cấp trên

     436              B.  Người cao tuổi hơn

                      C.  Cấp dưới

                      D.  A và B

             12.008 - Trách nhiệm đối với cộng đồng:

                      A.  Tham gia công tác xã hội

     437              B.  Hết mình với công việc

                      C.  Quan tâm tới khách hàng và đối tác

                      D.  Làm việc chuyên nghiệp, lịch sự, tận tình

             12.004 - Trách nhiệm đối với đồng nghiệp:

                      A.  Hết lòng hợp tác tương trợ đồng nghiệp trong công việc; Không đùn đẩy công việc lẫn nhau

     438              B.  Chung sức tạo lập môi trường làm việc nhân văn

                      C.  Tạo lập môi trường làm việc minh bạch, bình đẳng và có tổ chức

                      D.  Tất cả các đáp án trên

             12.009 - Điều nào sau đây thuộc phẩm chất đạo đức người Vietcombank?

                      A.  Tôn trọng pháp luật và các quy định nội bộ

     439              B.  Trung thành, luôn vì lợi ích Vietcombank

                      C.  Nhân ái, hoà đồng cùng tập thể, tích cực tham gia các hoạt động cộng đồng

                      D.  Tất cả các đáp án trên

     440     12.010 - Các chuẩn mực chung trong hành vi ứng xử của người Vietcombank là?

                      A.  - Tôn trọng đối tác tiếp xúc; - Tuân thủ quy định của luật pháp và nội bộ. - Tận tâm, hết lòng vì lợi ích cá
                          nhân và Vietcombank. - Hợp tác, hoà đồng cùng đồng nghiệp. - Ứng xử chân thành, lịch sự và thân
                          thiện.

                      B.  - Tôn trọng đối tác tiếp xúc; - Tuân thủ quy định của nội bộ và ngành. - Tận tâm, hết lòng vì lợi ích cá
                          nhân và Vietcombank. - Hợp tác, hoà đồng cùng đồng nghiệp, biết nhún nhường đúng lúc tránh xảy ra
                          xích mích. - Ứng xử chân thành, lịch sự và thân thiện.

                      C.  - Tôn trọng đối tác tiếp xúc; - Tuân thủ quy định của luật pháp. - Tận tâm, hết lòng vì lợi ích
                          Vietcombank. - Hợp tác cùng đồng nghiệp. - Ứng xử lịch sự và thân thiện.

                      D.  - Tôn trọng đối tác tiếp xúc; - Tuân thủ quy định của luật pháp và nội bộ. - Tận tâm, hết lòng vì lợi ích
                          Vietcombank. - Hợp tác, hoà đồng cùng đồng nghiệp. - Ứng xử chân thành, lịch sự và thân thiện.

             12.003 - Điều nào sau đây không thuộc trách nhiệm đối với khách hàng và đối tác:

                      A.  Bảo đảm lợi ích hợp lý cho khách hàng và đối tác

     441              B.  Bảo mật thông tin của khách hàng và đối tác

                      C.  Đáp ứng tất cả yêu cầu của khách hàng và đối tác

                      D.  Tác phong làm việc chuyên nghiệp, lịch sự và tận tình

             12.011 - Người thân của bạn dùng tài khoản Vietcombank chuyển tiền cùng hệ thống với số tiền 100 triệu
            đồng nhưng bị chuyển nhầm người thụ hưởng. Mặc dù người nhà đã tìm nhiều cách nhưng không liên lạc
            được với người nhận để đòi lại tiền nên vô cùng lo lắng. Trong trường hợp này, nếu bạn là cán bộ
            Vietcombank, bạn nên làm gì?

     442              A.  Liên hệ trong nội bộ, xin số điện thoại của người thụ hưởng cho người nhà liên hệ đòi lại tiền.

                      B.  Tư vấn người nhà đi báo công an để đảm bảo quyền lợi.

                      C.  Hướng dẫn người nhà đến quầy giao dịch của Vietcombank hoặc liên hệ VCC để được hỗ trợ.

                      D.  Tất cả các phương án trên

            08.032 - Ngày 14/06/2024, Khách hàng tại thành phố A có nhu cầu vay vốn để thanh toán tiền mua hàng nông
            sản từ công ty X trên cùng địa bàn. Số lượng mua hàng lớn, chia thành nhiều đơn hàng nên Khách hàng đề
             nghị được giải ngân vào TKTT của Khách hàng để Khách hàng chủ động thanh toán cho công ty X. Chi
             nhánh thực hiện:

                      A.  Giải ngân vào TKTT của Khách hàng và yêu cầu Khách hàng cung cấp bảng kê thu mua hàng hóa trong
                          vòng tối đa 10 ngày làm việc kể từ ngày giải ngân
     443
                      B.  Giải ngân vào TKTT của khách hàng sau khi Khách hàng đã cũng cấp đầy đủ hồ sơ, bao gồm cả bảng
                          kê thu mua hàng hóa

                      C.  Không giải ngân vào TKTT của khách hàng do không thuộc các trường hợp theo quy định được giải
                          ngân vốn vay vào TKTT của khách hàng

                      D.  Không giải ngân vào TKTT của Khách hàng do Khách hàng không đồng thời là bên thụ hưởng có TKTT
                          tại VCB

             12.013 - Khách hàng đến ngân hàng để phát hành thẻ. Tuy nhiên đến ngày hẹn, vợ của khách hàng (cũng là
             khách quen của ngân hàng) đến đề nghị nhận hộ thẻ do khách hàng đang bận đi công tác thời gian dài
             không đến nhận được mà gia đình lại có việc cần sử dụng thẻ để thanh toán chi tiêu nước ngoài. Trong
            trường hợp này, giao dịch viên cần xử lý thế nào?

                      A.  Giao thẻ cho vợ khách hàng mang về cùng phiếu xác nhận đã nhận thẻ để khách hàng ký và bổ sung
                          sau. Sau khi nhận được phiếu xác nhận, ngân hàng mới kích hoạt thẻ của khách hàng
     444
                      B.  Giải thích rõ cho vợ khách hàng biết là chị không thể nhận thay khách hàng được do chị không có ủy
                          quyền nhận thẻ từ khách hàng

                      C.  Báo cáo lãnh đạo và chờ lãnh đạo chỉ đạo giải quyết tình huống

                      D.  Giao thẻ cho vợ khách hàng và đề nghị vợ khách hàng ký nhận thẻ vào Phiếu xác nhận thay cho khách
                          hàng

             12.014 - Bạn là người quản lý dự án cho một sản phẩm huy động mới. Trong quá trình phát triển, một số
             phản hồi từ nhóm kiểm thử cho thấy sản phẩm có thể không hoàn toàn tuân thủ các quy định về trần lãi suất
             huy động. Bước tiếp theo quan trọng nhất của bạn là gì?

                      A.  Đề nghị nhóm phát triển tìm cách giải quyết các vấn đề trước khi tiếp tục
     445
                      B.  Quyết định tiếp tục triển khai sản phẩm, vì việc kiểm soát tuân thủ hoàn toàn có thể được giải quyết
                          bằng văn bản hành chính sau khi sản phẩm ra mắt

                      C.  Tạm thời ngưng nghiên cứu phát triển sản phẩm

                      D.  Báo cáo ngay lập tức cho ban lãnh đạo và yêu cầu hướng dẫn về cách tiếp tục

     446     12.002 - Bản sắc văn hóa Vietcombank được tóm tắt trong mấy giá trị cơ bản?

                      A.  3

                      B.  4

                      C.  5

                      D.  6

             12.016 - Phương châm hành động của Vietcombank là gì?

                      A.  Phát triển - Bền vững - Nhân văn

     447              B.  Chuyển đổi - Hiệu quả - Bền Vững

                      C.  Chuyển đổi - Phát triển - Nhân văn

                      D.  Chuyển đổi - Nhân văn - Bền vững

             12.017 - Phát biểu nào sau đây đúng về trách nhiệm của cán bộ Vietcombank đối với khách hàng, đối tác

                      A.  Có thể cung cấp một số thông tin cơ bản của khách hàng cho người quen

     448              B.  Giữ gìn chữ tín mọi lúc mọi nơi

                      C.  Luôn đảm bảo lợi ích của Vietcombank lớn hơn lợi ích của đối tác, khách hàng

                      D.  Không có đáp án đúng

             12.001 - Sứ mệnh của Vietcombank là:

                      A.  Dẫn dắt hành trình số hóa của ngành tài chính, tạo động lực cho mỗi cá nhân, doanh nghiệp và tổ chức
                          phát triển bền vững và bứt phá thành công

     449              B.  Ngân hàng hàng đầu vì Việt Nam thịnh vượng

                      C.  Đáp ứng kỳ vọng khách hàng bằng việc cung cấp dịch vụ và giải pháp tài chính với mục tiêu lấy khách
                          hàng làm trọng tâm

                      D.  Tăng trưởng giá trị đầu tư trên cơ sở phát triển bền vững

             12.018 - Hình ảnh, thương hiệu Vietcombank có ý nghĩa gì?

                      A.  Xanh và Mạnh

     450              B.  Uy tín và hiện đại

                      C.  Gần gũi, biết sẻ chia

                      D.  Tất cả đáp án trên đều đúng

             12.020 - Khi tham gia cuộc họp, Anh/Chị nên lưu ý điều gì?

                      A.  Đến trước 5 phút trước khi cuộc họp bắt đầu

     451              B.  Chuông điện thoại di động phải chuyển sang chế độ rung trong khi họp. Hạn chế dùng điện thoại trong
                          khi họp

                      C.  Quan sát cách bố trí phòng họp, thành phần tham dự cuộc họp để chọn chỗ ngồi họp phù hợp

                      D.  Tất cả đáp án trên đều đúng

             15.026 - Các đợt tiêm phòng dịch để chống lại các bệnh lây lan tạo ra:

                      A.  Ngoại ứng tiêu cực

     452              B.  Ngoại ứng tích cực

                      C.  Thất bại thị trường

                      D.  Cung cấp hàng hóa công cộng

             15.027 - Rào cản gia nhập thị trường bao gồm:

                      A.  Bằng phát minh sáng chế

     453              B.  Đặc quyền kinh doanh của chính phủ

                      C.  Tính kinh tế của quy mô

                      D.  Tất cả các phương án trên

             15.025 - Các hãng tư nhân không thích cung cấp hàng hóa công cộng vì:

                      A.   Hãng tư nhân hoạt động không hiệu quả

     454              B.  Đầu tư vào ngành công cộng đòi hỏi quá nhiều vốn

                      C.  Vấn đề tiêu dùng tự do (không phải trả tiền)

                      D.  Các hãng tư nhân nhìn chung định giá cao hơn nhà nước và bởi vậy mất khách hàng

             15.028 - Chi phí biến đổi là:

                      A.  Chi phí không đổi khi sản lượng thay đổi

     455              B.  Tổng giá trị thị trường của các yếu tố sản xuất

                      C.  Chi phí thay đổi khi sản lượng thay đổi

                      D.  Tất cả các phương án trên

             15.029 - Việc lên ngân sách hàng tháng rất quan trọng, bởi nó sẽ giúp bạn:

                      A.  Chi tiêu lớn hơn thu nhập của bạn ở thời điểm hiện tại

     456              B.  Giúp bạn tiết kiệm chi phí đi lại bằng cách mua một chiếc xe mới mỗi 2 hoặc 3 năm

                      C.  Quản lý chi tiêu và tiết kiệm trong tương lai để tích lũy tài sản

                      D.  Chắc chắn sở hữu những món đồ bạn thích

             15.024 - Hàng hóa cá nhân là những hàng hóa mà việc tiêu dùng chúng:

                      A.   Không có tính cạnh tranh

     457              B.   Không có tính loại trừ

                      C.   Bị điều tiết

                      D.  Có tính cạnh tranh

             15.030 - Đâu là nơi tốt nhất để lưu giữ khoản tiền để xử lý những tình huống bất thường?

                      A.  Thị trường cổ phiếu

     458              B.  Quỹ chi tiêu hàng ngày

                      C.   Bất động sản

                      D.  Tài khoản tiết kiệm

             15.031 - Mục đích chính của bảo hiểm là:

                      A.  Tăng tài sản của người mua

     459              B.  Tiết kiệm tiền học đại học

                      C.  Chuyển giao rủi ro

                      D.  Giảm thiểu tất cả các rủi ro

             15.023 - Giảm giá vé xem phim buổi ban ngày dẫn đến tổng doanh thu bán vé giảm xuống, ta kết luận cầu
             theo giá đối với phim chiếu vào bán ngày:

                      A.  Co giãn
     460
                      B.   Ít co giãn

                      C.  Co giãn đơn vị

                      D.  Co giãn hoàn toàn

             15.032 - Để quản lý tốt tiền của mình, bạn nên:

                      A.   Nhận sao kê tài khoản ngân hàng mỗi tháng

     461              B.  Tăng cường mua sắm vào những dịp khuyến mại

                      C.   Lập kế hoạch ngân sách chi tiết

                      D.  Tìm kiếm công việc có thu nhập cao

             15.033 - Theo bạn, 5 nhân tố nào ảnh hưởng lớn nhất đến điểm tín dụng của một cá nhân?

                      A.  Tổng số tiền nợ + lãi suất cao nhất của khoản vay + số thẻ ngân hàng và thẻ hội viên mà người đó sở
                          hữu + các khoản nợ quá hạn + số nợ trung bình qua thời gian

     462              B.  Tổng thu nhập + số thẻ ngân hàng và thẻ hội viên mà người đó sở hữu + lịch sử thanh toán + số tiền đã
                          từng phạt vì trả chậm + khoản tiết kiệm của người đó

                      C.  Nụ cười thân thiện + quan điểm sống tích cực + lời hứa sẽ có trách nhiệm cao + ánh mắt đẹp

                      D.  Lịch sử thanh toán + tỷ lệ sử dụng nợ tín dụng + các ứng dụng thanh toán + thời gian vay nợ tín dụng +
                          loại thẻ tín dụng

             15.034 - Tài sản ròng của cá nhân được tính như thế nào?

                      A.  Tổng tài sản – Tổng nghĩa vụ nợ phải trả

     463              B.  Thu nhập từ lương hàng tháng

                      C.  Thu nhập – Nợ

                      D.  Nghề nghiệp của cá nhân

             15.022 - Một hãng nên đóng cửa sản xuất nếu giá:

                      A.  Lớn hơn chi phí biến đổi trung bình tối thiểu

     464              B.  Nhỏ hơn chi phí biến đổi trung bình tối thiểu

                      C.  Lớn hơn chi phí cố định trung bình tối thiểu

                      D.  Nhỏ hơn doanh thu trung bình tối thiểu

             15.035 - Lợi ích của việc hiểu biết về tài chính cá nhân không bao gồm yếu tố nào:

                      A.  Đưa ra các quyết định sáng suốt về tình hình tài chính của bạn

     465              B.  Trở thành nhà đầu cơ chuyên nghiệp

                      C.  Đánh giá các tư vấn của các chuyên gia tài chính

                      D.  Có thể tư vấn tài chính cho người khác

             15.036 - Bước đầu tiên để giúp bạn có một kế hoạch tài chính tốt là:

                      A.  Phân tích thực trạng tài chính hiện tại

     466              B.  Thiết lập các mục tiêu tài chính

                      C.  Huy động các nguồn lực để thực hiện

                      D.  Đánh giá các phương án đạt được mục tiêu

             15.021 - Nếu cầu không co giãn, muốn tăng tổng doanh thu thì phải:

                      A.  Giảm giá bán

     467              B.  Tăng giá bán

                      C.  Giữ nguyên giá

                      D.  Không câu nào đúng

             15.037 - Yếu tố nào dưới đây ảnh hưởng trực tiếp đến nguồn thu nhập của bạn:

                      A.  Nghề nghiệp

     468              B.  Số thành viên trong gia đình

                      C.  Thói quen chi tiêu

                      D.  Văn hóa truyền thống gia đình

     469     15.038 - Nội dung nào dưới đây không thuộc danh mục tài sản thuộc sở hữu của cá nhân:

                      A.  Tài khoàn tiết kiệm

                      B.  Dư nợ thẻ tín dụng

                      C.  Cổ phiếu

                      D.  Đồ dùng gia đình

             15.020 - Lợi nhuận của doanh nghiệp chịu ảnh hưởng bởi:

                      A.  Quy mô sản xuất hàng hóa, dịch vụ

     470              B.  Giá cả thị trường của hàng hóa, dịch vụ

                      C.  Giá cả thị trường của yếu tốt sản xuất

                      D.  Tất cả các phương án trên

             15.039 - Khoản thu nhập nào của cá nhân không phải chịu thuế thu nhập cá nhân theo quy định hiện hành
            của Việt Nam:

                      A.  Tiền lương
     471
                      B.  Phụ cấp đặc thù ngành nghề

                      C.  Thu nhập từ đầu tư vốn

                      D.  Thu nhập từ nhận thừa kế, quà tặng

             15.040 - Hình thức cắt giảm chi phí nào đối với cá nhân không hiệu quả:

                      A.  Mang bữa ăn trưa đến công ty

     472              B.  Mua đồ khuyến mãi vì có giá rẻ

                      C.  Lên danh sách những thứ bạn cần trước khi đi mua sắm

                      D.  Thanh toán các hoá đơn đúng hạn

             15.041 - Bên cho vay sẽ căn cứ vào chỉ tiêu chính nào khi thẩm định hồ sơ vay vốn của một cá nhân:

                      A.  Tình trạng hôn nhân

     473              B.  Năng lực trả nợ

                      C.  Trình độ học vấn

                      D.  Thói quen chi tiêu

             15.019 - Chính sách tiền lương tối thiểu nhằm mục đích:

                      A.  Bảo vệ lợi ích của các doanh nghiệp sử dụng lao động

     474              B.  Khắc phục hiện tượng thất nghiệp

                      C.  Ngược lại với mục đích hoạt động của các nghiệp đoàn

                      D.  Nâng cao tiền lương của người lao động

            08.029 - Khách hàng SME A đề nghị VCB - Chi nhánh X cho vay tài trợ kinh doanh phân bón hóa học và thế
            chấp TSBĐ là chính lô phân bón hóa học hình thành từ vốn vay VCB. Trường hợp Đơn vị kinh doanh cấp tín
            dụng không theo sản phẩm, theo quy định tại Hướng dẫn chính sách bảo đảm tín dụng, mức cấp tín dụng tối
            đa trên giá trị TSBĐ đối với TSBĐ trên là bao nhiêu?

     475              A.  70%

                      B.  60%

                      C.  50%

                      D.  40%

             15.042 - Hình thức vay vốn nào của cá nhân hiện nay không được thực hiện tại các ngân hàng thương mại
            Việt Nam:

                      A.  Vay tín chấp
     476
                      B.  Vay ngang hàng

                      C.  Vay trả góp

                      D.  Vay thế chấp

     477     15.043 - Hình thức đầu tư nào có mức rủi ro cao nhất trong danh mục dưới đây:

                      A.  Chứng chỉ tiền gửi ngân hàng

                      B.  Cổ phiếu

                      C.  Trái phiếu

                      D.  Tín phiếu kho bạc

             15.018 - Kiểm soát giá được áp dụng:

                      A.  Như một cách để tăng nguồn thu cho các công trình công cộng

     478              B.  Khi nhà hoạch định chính sách cho rằng giá cả hàng hóa, dịch vụ trên thị trường không công bằng đối
                          với người mua hoặc người bán

                      C.  Khi nhà hoạch định chính sách phát hiện ra lỗ hổng thị trường

                      D.  Tất cả các phương án trên

             15.044 - Trong hoạt động đầu tư, rủi ro nào xuất phát từ bản thân nhà đầu tư:

                      A.  Rủi ro do sử dụng đòn bẩy tài chính không hợp lý

     479              B.  Rủi ro thông tin

                      C.  Rủi ro thị trường

                      D.  Rủi ro pháp lý

             15.045 - Hình thức nào là phù hợp để giảm thiểu rủi ro tài chính cá nhân:

                      A.  Không thực hiện đầu tư

     480              B.  Uỷ thác tài sản cho nhà đầu tư khác

                      C.  Tích trữ tài sản bằng vàng

                      D.  Đa dạng hoá danh mục đầu tư

             15.017 - Nếu giá thịt lợn đang ở điểm cân bằng thì:

                      A.  Thịt lợn là hàng hóa thông thường

     481              B.  Người sản xuất muốn bán nhiều hơn tại mức giá hiện tại

                      C.  Người tiêu dùng muốn mua nhiều hơn tại mức giá hiện tại

                      D.  Lượng cung bằng với lượng cầu

             15.046 - Tháng 5 năm N, ông An bỏ ra 100 triệu đồng để mua 10 trái phiếu kho bạc có kỳ hạn 10 năm, mệnh
            giá 10 triệu đồng, lãi suất coupon 5%. Tháng 10 năm N, kho bạc tiếp tục phát hành trái phiếu mới cùng mệnh
            giá 10 triệu đồng, kì hạn 20 năm với giá bán 10 triệu đồng, lãi suất coupon 7%. Trong trường hợp này ông An
            đang gặp rủi ro gì:

     482              A.  Rủi ro tín dụng

                      B.  Rủi ro lãi suất

                      C.  Rủi ro thanh khoản

                      D.  Rủi ro kỳ hạn

             15.047 - Nhà đầu tư cá nhân thường mắc sai lầm nào dưới đây:

                      A.  Gửi tiết kiệm ngân hàng dài hạn

     483              B.  Đầu tư theo đám đông

                      C.  Đi vay vốn để đầu tư

                      D.  Đầu tư ngoại tệ

     484     15.048 - Việc cá nhân, hộ gia đình lên kế hoạch để có khoản tiền cho kỳ nghỉ hè hàng năm được coi là một ví
            dụ của:

                      A.  Thực hiện điều cần thiết

                      B.  Việc đầu tư

                      C.  Đặt mục tiêu tài chính

                      D.  Tích luỹ tài sản chung

             15.016 - Nếu chính phủ muốn giá lúa giảm chính phủ có thể làm điều nào sau đây?

                      A.  Mua lúa của nông dân cho quỹ dự trữ quốc gia

     485              B.  Tăng thuế từ phân bón

                      C.  Giảm diện tích trồng lúa

                      D.  Tăng diện tích trông lúa

             15.049 - Đối với một người bình thường, điều nào dưới đây là cách tốt nhất để đạt được an toàn tài chính:

                      A.  Tìm kiếm và làm công việc có mức lương cao

     486              B.  Có tài sản thừa kế

                      C.  Làm nhiều công việc một lúc

                      D.  Bắt đầu tiết kiệm hoặc đầu tư từ sớm

             15.050 - Bước đầu tiên trong quản lý tài chính cá nhân là gì?

                      A.  Lập ngân sách

     487              B.  Tính toán các khoản chi

                      C.  Đầu tư

                      D.  Xác định mục tiêu

             15.015 - Đặc điểm nào sau đây không phải là của thị trường cạnh tranh hoàn hảo?

                      A.  Người bán khác nhau bán sản phẩm giống nhau

     488              B.  Có rất nhiều người bán

                      C.  Người bán phải chấp nhận giá trên thị trường

                      D.  Tất cả các đặc điểm trên đều là đặc điểm của thị trường cạnh tranh hoàn hảo

             15.051 - Đâu không phải là lý do khiến bạn không cắt giảm được chi tiêu?

                      A.  Không ghi chép lại các chi tiêu trong ngày

     489              B.  Đặt mục tiêu tài chính không cụ thể

                      C.  Đặt mục tiêu tài chính quá cao

                      D.  Đầu tư vào nhiều loại tài sản khác nhau

             15.052 - Làm thế nào để giảm thiểu rủi ro phi hệ thống trong đầu tư?

                      A.  Chỉ nên đầu tư vào một loại tài sản

     490              B.  Mua chứng chỉ quỹ đầu tư

                      C.  Đa dạng hoá danh mục đầu tư

                      D.  Không thể giảm thiểu được

             15.014 - Trên thị trường cạnh tranh hoàn hảo, người mua:

                      A.  Là người chấp nhận giá, người bán là người ấn định giá

     491              B.  Là người ấn định giá, người bán là người chấp nhận giá

                      C.  Và người bán là người chấp nhận giá

                      D.  Và người bán là người ấn định giá

     492     15.053 - Trong điều kiện mức lãi suất và kỳ hạn bằng nhau, hình thức tiết kiệm nào có lợi cho cá nhân nhất

             khi gửi tiền tại ngân hàng:

                      A.  Gửi tiết kiệm trả lãi trước

                      B.  Gửi tiết kiệm trả lãi định kỳ

                      C.  Gửi tiết kiệm trả lãi cuối kỳ

                      D.  Gửi tiết kiệm gửi góp

             15.054 - Khi bạn thực hiện vay vốn ngân hàng với mục đích mua nhà để ở (có tình trạng hôn nhân: đã kết
             hôn). Nghĩa vụ trả nợ Ngân hàng thuộc về:

                      A.  Người chồng
     493
                      B.  Người vợ

                      C.  Cả 2 vợ chồng

                      D.  Tất cả các thành viên trong gia đình bạn

             15.055 - Khi thực hiện phương án vay vốn ngân hàng, bạn cần tính toán nghĩa vụ trả nợ của các khoản vay
            từ

                      A.  Thẻ tín dụng
     494
                      B.  Tất cả các khoản vay theo món

                      C.  Tất cả các khoản vay theo Hạn mức

                      D.  Tất cả các phương án trên

             15.013 - Trên thị trường cạnh tranh hoàn hảo, giá cả một mặt hàng:

                      A.  Được xác định bởi người mua, và khối lượng sản phẩm sản xuất do người bán quyết định

     495              B.  Được xác định bởi người bán, và khối lượng sản phẩm sản xuất do người mua quyết định

                      C.  và khối lượng sản phẩm sản xuất đều do người bán quyết định

                      D.  Không câu nào đúng

             15.056 - Bạn có thể sử dụng tiền gửi tiết kiệm cho mục đích sau:

                      A.  Chứng minh tài chính

     496              B.  Chuyển nhượng, cho tặng

                      C.  Cầm cố để vay vốn Ngân hàng

                      D.  Tất cả các phương án trên

             15.057 - Bạn có thể sử dụng thẻ tín dụng cho việc sau:

                      A.  Tiêu trước trả sau một khoản trong hạn mức đã được Ngân hàng phê duyệt

     497              B.  Chi tiêu 1 khoản bất kỳ mà không cần quan tâm mình đang có tiền hay không

                      C.  Được phép chi tiêu 1 khoản trong phạm vi số dư khả dụng của tài khoản thanh toán

                      D.  Tất cả các phương án trên

             15.012 - Khi tỷ lệ lạm phát giảm, điều này có thể do ngân hàng trung ương đã:

                      A.  Mua trái phiếu trên thị trường mở làm tăng cung tiền

     498              B.  Mua trái phiếu trên thị trường mở làm giảm cung tiền

                      C.  Bán trái phiếu trên thị trường mở làm tăng cung tiền

                      D.  Bán trái phiếu trên thị trường mờ làm giảm cung tiền

             15.058 - Dư nợ thẻ tín dụng của bạn chính là:

                      A.  Một khoản vay Ngân hàng

     499              B.  Một khoản tiền gửi tại Ngân hàng

                      C.  Một khoản bảo lãnh

                      D.  Tất cả các phương án trên

     500     15.059 - Để thực hiện phương án vay vốn, bạn cần tính đến các nguồn tài chính để trả nợ, bao gồm các

             nguồn sau:

                      A.  Thu nhâp thường xuyên từ Lương, thưởng hợp pháp

                      B.  Thu nhập đem lại từ Tài sản đảm bảo đang được thế chấp tại Ngân hàng

                      C.  Thu nhập từ việc kinh doanh chứng khoán

                      D.  Thu nhập từ việc kinh doanh hàng quốc cấm

             15.060 - Theo bạn, một cá nhân ở lứa tuổi trung niên sẽ ưu tiên sử dụng các sản phẩm tài chính có đặc điểm
             nào dưới đây:

                      A.  Sản phẩm tài chính ứng dụng công nghệ cao, nhiều tiện ích
     501
                      B.  Sản phẩm tài chính có yếu tố rủi ro và mức sinh lời kỳ vọng cao

                      C.  Sản phẩm tài chính an toàn, mức sinh lời ổn định

                      D.  Sản phẩm tài chính mới, có tính sáng tạo, độc đáo

             15.011 - Sự kết hợp chính sách kinh tế vĩ mô nào sau đây sẽ làm tăng sản lượng nền kinh tế cao nhất:

                      A.  Chính sách tài khóa mở rộng và chính sách tiền tệ mở rộng

     502              B.  Chính sách tài khóa thắt chặt và chính sách tiền tệ thắt chặt

                      C.  Chính sách tài khóa mở rộng và chính sách tiền tệ thắt chặt

                      D.  Chính sách tài khóa thắt chặt và chính sách tiền tệ mở rộng

             15.061 - Yếu tố nào sau đây ảnh hưởng đến quyết định đầu tư của cá nhân:

                      A.  Nguồn thu nhập và đặc điểm cá nhân

     503              B.  Điều kiện thị trường

                      C.  Khẩu vị rủi ro

                      D.  Tất cả các phương án trên

             16.001 - Cá nhân hóa trải nghiệm người dùng trong ngân hàng bán lẻ có nghĩa là gì?

                      A.  Cung cấp dịch vụ ngân hàng theo nhu cầu chung của thị trường

     504              B.  Tạo ra các sản phẩm và dịch vụ phù hợp với nhu cầu cá nhân của từng khách hàng

                      C.  Sử dụng công nghệ blockchain để tăng cường bảo mật

                      D.  Áp dụng các biện pháp bảo vệ dữ liệu cá nhân của khách hàng

             15.010 - Khi lãi suất trong nước cao hơn lãi suất thế giới sẽ làm:

                      A.  Lạm phát tăng

     505              B.  Đồng ngoại tệ tăng giá so với đồng ngoại tệ

                      C.  Đồng nội tệ tăng giá so với đồng ngoại tệ

                      D.  Thất nghiệp giảm

             16.002 - Lợi ích chính của cá nhân hóa trải nghiệm người dùng là gì?

                      A.  Giảm chi phí vận hành ngân hàng

     506              B.  Tăng cường bảo mật dữ liệu

                      C.  Nâng cao sự hài lòng và gắn bó của khách hàng

                      D.  Tăng doanh thu cho ngân hàng

     507    08.030 - Khách hàng B là SME siêu nhỏ kinh doanh trong lĩnh vực sản xuất giấy. Khách hàng B có nhu cầu đề

             nghị VCB - Chi nhánh X cấp tín dụng để đầu tư sản xuất kinh doanh giấy và thế chấp TSBĐ là thành phẩm
            giấy khách hàng sản xuất ra. Trường hợp sản phẩm không có quy định, theo quy định tại Hướng dẫn chính
            sách bảo đảm tín dụng, khách hàng phải thực hiện mua bảo hiểm với số tiền bảo hiểm tối thiểu bằng bao
             nhiêu?

                      A.  Số tiền bảo hiểm tối thiểu bằng = min{giá trị HHBĐ tại thời điểm nhận bảo đảm theo quy định của VCB
                          về định giá; 110% số dư cấp tín dụng gốc được bảo đảm bằng TSBĐ đó}

                      B.  Số tiền bảo hiểm tối thiểu bằng = min{giá trị HHBĐ tại thời điểm nhận bảo đảm theo quy định của VCB
                          về định giá; số dư cấp tín dụng gốc được bảo đảm bằng TSBĐ đó}


                      C.  Số tiền bảo hiểm tối thiểu bằng giá trị HHBĐ tại thời điểm nhận bảo đảm theo quy định của VCB về định
                          giá

                      D.  Số tiền bảo hiểm tối thiểu bằng số dư cấp tín dụng gốc được bảo đảm bằng TSBĐ đó

             16.004 - Ngân hàng bán lẻ có thể thu thập thông tin cá nhân của khách hàng từ đâu để cá nhân hóa dịch vụ?

                      A.  Chỉ từ giao dịch trực tuyến

     508              B.  Từ tất cả các điểm tiếp xúc khách hàng, bao gồm trực tuyến và ngoại tuyến

                      C.  Chỉ từ cuộc gọi dịch vụ khách hàng

                      D.  Chỉ từ các giao dịch tại quầy

             15.009 - Cán cân thương mại thặng dư sẽ làm:

                      A.  Đồng tiền Việt Nam tăng giá so với đồng đô la Mỹ

     509              B.  Đồng tiền Việt Nam mất giá so với đồng đô la Mỹ

                      C.  Giá đồng tiền Việt Nam không đổi

                      D.  Không câu nào đúng

             16.013 - Vietcombank chính thức ra mắt Trợ lý ảo VCB Digibot trong hoạt động chăm sóc khách hàng trên
             kênh Website và Fanpage từ ngày nào?

                      A.  Ngày 09/10/2022
     510
                      B.  Ngày 14/06/2023

                      C.  Ngày 09/07/2022

                      D.  Ngày 12/06/2023

             16.014 - Chatbot trong ngân hàng bán lẻ thường được sử dụng để làm gì?

                      A.  Thực hiện giao dịch tài chính phức tạp

     511              B.  Cung cấp hỗ trợ khách hàng 24/7

                      C.  Đánh giá tín dụng khách hàng

                      D.  Quản lý tài sản đầu tư

             16.016 - Chatbot được hỗ trợ bởi AI có thể giúp ngân hàng bán lẻ làm gì?

                      A.  Phân tích thị trường chứng khoán

     512              B.  Tự động hóa dịch vụ khách hàng

                      C.  Quản lý rủi ro tín dụng

                      D.  Phát triển sản phẩm mới

             15.008 - Để tăng cung tiền, Ngân hàng Nhà nước Việt Nam sẽ:

                      A.  Tăng tỷ lệ dữ trự bắt buộc

     513              B.  Mua trái phiếu trên thị trường mở

                      C.  Bán ngoại tệ cho các tổ chức tín dụng

                      D.  Tăng lãi suất chiết khấu

             16.018 - Trợ lý ảo có thể hỗ trợ khách hàng ngân hàng bán lẻ như thế nào?

                      A.  Dự đoán xu hướng thị trường chứng khoán

     514              B.  Quản lý chi tiêu cá nhân và ngân sách

                      C.  Đánh giá hiệu suất nhân viên

                      D.  Thiết lập và duy trì quan hệ đối tác kinh doanh

     515     16.024 - Trợ lý ảo VCB Digibot phát triển trên nền tảng nào

                      A.  Nền tảng Viettel AI Open Platform

                      B.  Nền tảng VNPT.AI

                      C.  Nền tảng Vin.AI

                      D.  Nền tảng FPT.AI

             15.007 - Khi Ngân hàng Nhà nước Việt Nam mua trái phiếu trên thị trường mở, cung tiền sẽ:

                      A.  Tăng và đường tổng cầu dịch sang phải

     516              B.  Tăng và đường tổng cầu dịch sang trái

                      C.  Giảm và tổng cầu dịch sang phải

                      D.  Giảm và đường tổng cầu dịch sang trái

             16.025 - Một lợi ích chính của ngân hàng mở đối với khách hàng là gì?

                      A.  Tăng cường tính bảo mật thông tin

     517              B.  Tiếp cận nhiều dịch vụ tài chính hơn từ các bên thứ ba

                      C.  Giảm phí dịch vụ ngân hàng

                      D.  Tăng khả năng tiếp cận tín dụng

             16.027 - Làm thế nào ngân hàng mở có thể cải thiện dịch vụ khách hàng?

                      A.  Cung cấp thông tin thời gian thực về thị trường chứng khoán

     518              B.  Cung cấp các dịch vụ tài chính từ các bên thứ ba với sự đồng ý của khách hàng

                      C.  Tăng cường bảo mật thông tin cá nhân

                      D.  Giảm lãi suất cho vay

             15.006 - Đâu là trật tự thích hợp khi ngân hàng trung ương thay đổi chính sách tiền tệ?

                      A.  Cầu tiền thay đổi, tổng cầu thay đổi, và sau đó đầu tư thay đổi

     519              B.  Cầu tiền thay đổi, đầu tư thay đổi, tổng cầu thay đổi

                      C.  Cung tiền không đổi nhưng đầu tư tăng lên

                      D.  Cung tiền thay đổi, lãi suất thay đổi, đầu tư thay đổi và tổng cầu thay đổi

             16.028 - API trong ngân hàng mở có vai trò gì?

                      A.  Giúp kết nối các dịch vụ tài chính từ nhiều nhà cung cấp khác nhau

     520              B.  Phân tích dữ liệu khách hàng

                      C.  Quản lý rủi ro tín dụng

                      D.  Giảm chi phí giao dịch

             16.029 - Ngân hàng mở yêu cầu sự hợp tác chặt chẽ giữa những bên nào?

                      A.  Ngân hàng và khách hàng

     521              B.  Ngân hàng và các tổ chức bên thứ ba

                      C.  Chính phủ và ngân hàng

                      D.  Khách hàng và các tổ chức tín dụng

             16.030 - Để thực hiện thành công ngân hàng mở, các tổ chức tài chính cần phải đảm bảo điều gì?

                      A.  Giảm lãi suất vay

     522              B.  Tuân thủ các tiêu chuẩn API mở và bảo mật dữ liệu

                      C.  Tăng số lượng nhân viên

                      D.  Giảm chi phí vận hành

     523     15.005 - Ở Việt Nam chỉ số giá tiêu dùng hàng tháng do…......công bố?

                      A.  Ngân hàng Nhà nước Việt Nam

                      B.  Bộ Tài chính

                      C.  Tổng cục hải quan

                      D.  Tổng cục thống kê

             16.031 - Một trong những rủi ro chính khi triển khai ngân hàng mở là gì?

                      A.  Tăng chi phí vận hành

     524              B.  Nguy cơ mất an toàn dữ liệu khách hàng

                      C.  Giảm số lượng khách hàng

                      D.  Tăng phí dịch vụ

             16.036 - Một trong những lợi ích chính của việc áp dụng API mở trong ngân hàng là gì?

                      A.  Tăng chi phí vận hành

     525              B.  Mở rộng hệ sinh thái dịch vụ tài chính và tạo ra các cơ hội kinh doanh mới

                      C.  Giảm số lượng khách hàng

                      D.  Tăng lãi suất cho vay

             15.004 - Khi Ngân hàng Nhà nước Việt Nam tăng tỷ lệ dự trữ bắt buộc:

                      A.  Lãi suất cho vay của các ngân hàng thương mại giảm

     526              B.  Mức giá trong nền kinh tế giảm

                      C.  Tỷ lệ thất nghiệp giảm

                      D.  GDP tăng

             16.038 - Yếu tố nào sau đây không thuộc về chiến lược bảo vệ dữ liệu khách hàng?

                      A.  Sử dụng mã hóa mạnh

     527              B.  Đào tạo nhân viên về an ninh mạng

                      C.  Mở rộng mạng lưới chi nhánh

                      D.  Cập nhật phần mềm định kỳ

             16.039 - Công nghệ xác thực hai yếu tố (2FA) thường được sử dụng để làm gì?

                      A.  Tăng cường bảo mật khi đăng nhập tài khoản trực tuyến

     528              B.  Quản lý thông tin tài chính cá nhân

                      C.  Phân tích dữ liệu khách hàng

                      D.  Xây dựng hệ thống dự báo tài chính

             15.003 - Nghiệp vụ thị trưởng mở của Ngân hàng Nhà nước Việt Nam sẽ làm:

                      A.  Thay đổi cung tiền

     529              B.  Thay đổi tỷ giá

                      C.  Thay đổi lãi suất

                      D.  Tất cả các phương án trên

             16.040 - Biện pháp nào giúp bảo vệ dữ liệu khách hàng khỏi các cuộc tấn công mạng?

                      A.  Sử dụng tường lửa và mã hóa dữ liệu

     530              B.  Tăng số lượng chi nhánh

                      C.  Tăng cường chương trình khách hàng thân thiết

                      D.  Giảm phí giao dịch

     531     16.041 - Yếu tố quan trọng nhất trong chiến lược bảo mật của ngân hàng là gì?

                      A.  Chi phí vận hành

                      B.  Bảo mật thông tin khách hàng

                      C.  Số lượng nhân viên

                      D.  Chiến lược tiếp thị

             16.042 - Xác thực sinh trắc học là gì?

                      A.  Sử dụng đặc điểm sinh học cá nhân để xác thực danh tính

     532              B.  Sử dụng mật khẩu dài

                      C.  Xác thực qua email

                      D.  Xác thực qua tin nhắn văn bản

             15.002 - Chính sách kích cầu bằng tăng chi tiêu chính phủ giúp nền kinh tế:

                      A.  Tăng trưởng

     533              B.  Kiềm chế được lạm phát

                      C.  Xuất siêu

                      D.  Tăng thất nghiệp

             16.043 - Phần mềm nào giúp phát hiện và ngăn chặn các phần mềm độc hại xâm nhập vào hệ thống ngân
             hàng?

                      A.  Microsoft Office
     534
                      B.  Anti-malware

                      C.  Adobe Photoshop

                      D.  Skype

             16.044 - Để giảm nguy cơ gian lận, nhân viên ngân hàng bán lẻ nên được đào tạo về

                      A.  Kỹ năng bán hàng

     535              B.  Kỹ năng excel

                      C.  Kỹ năng bảo mật thông tin

                      D.  Kỹ năng giao tiếp xã hội

             15.001 - Các gói hỗ trợ của Chính phủ có giá trị lớn được thực hiện trên phạm vi toàn cầu nhằm hỗ trợ
            doanh nghiệp, cá nhân, hộ gia đình chịu tác động của đại dịch, đã gây ra:

                      A.  Bất ổn thương mại
     536
                      B.  Gia tăng nợ xấu trong hệ thống ngân hàng

                      C.  Gia tăng thâm hụt ngân sách và gánh nặng nợ toàn cầu

                      D.  Lạm phát

             16.045 - Điều gì là quan trọng nhất khi thiết lập mật khẩu cho tài khoản ngân hàng

                      A.  Sử dụng tên người thân

     537              B.  Sử dụng ngày sinh

                      C.  Sử dụng mật khẩu dài và phức tạp

                      D.  Sử dụng từ ngữ đơn giản

             16.050 - Điều nào trong Luật các tổ chức tín dụng năm 2024 (có hiệu lực thi hành từ ngày 01/07/2024) có quy
            định về bảo mật thông tin khách hàng

                      A.  Điều 10
     538
                      B.  Điều 11

                      C.  Điều 12

                      D.  Điều 13


`;

const jsonData = convertTextToJSON(textContent);
const sortedData = jsonData.sort((a, b) => a.code.localeCompare(b.code));
console.log(JSON.stringify(sortedData))