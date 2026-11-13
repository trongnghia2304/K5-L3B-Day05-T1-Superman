# Bài nộp LAB5 - T1 Y tế · Nhóm Superman

**Lớp:** L3B
**Lớp:** L3B · **Bàn / zone:** B · **Track:** T1 - Y tế (kênh chat "Hỏi dược sĩ" Pharmacity)

| Họ và Tên                | Mã Học Viên | Việc đã làm |
| ------------------------ | ----------- | ----------- |
| Nguyễn Trọng Nghĩa       | 2A202603835 | Chặng 1, 2  |
| Nguyễn Nghiêm Khánh Tiệp | 2A202603863 | Chặng 3     |
| Nguyễn Nam Khánh         | 2A202603871 | Chặng 4     |
| Nguyễn Văn Hùng          | 2A202603816 | Chặng 5, 6  |

---

## §1. Lát cắt & phạm vi

**Lát cắt:** Trong **kênh chat Hỏi dược sĩ của Pharmacity**, khi **khách** đang nhắn hỏi _"tôi (hoặc người nhà) bị X, có thuốc gì không"_, **AI tự trả lời và gợi ý sản phẩm, hỏi thêm câu sàng lọc, hay chuyển dược sĩ, khuyên đi khám ngay**, để người dùng thuốc không nhận sai sản phẩm và ca nguy hiểm không nằm trong hàng chờ.

| Một người dùng                             | Một việc                      | Một quyết định của AI                                                                                  | Một kết quả                                                                     |
| ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| khách (thường nhắn hộ người nhà, tối muộn) | hỏi "bị X, có thuốc gì không" | chọn 1 trong 4 đường: **gợi ý** · **hỏi sàng lọc** · **chuyển dược sĩ** · **khuyên đi khám / cấp cứu** | người dùng thuốc không nhận sai sản phẩm; ca nguy hiểm không nằm trong hàng chờ |

**Đọc đề - AI được thêm quyền gì so với hôm nay.** Theo mục "Sản phẩm thật hôm nay", trợ lý AI chỉ trả lời giá / tồn kho / khuyến mãi / nhận ảnh bao bì, còn **mọi câu chuyên môn đều chuyển dược sĩ**. Lát cắt này cho AI thêm quyền **tự quyết câu chuyên môn nào nó trả lời** (gợi ý sản phẩm qua `goi_y_san_pham`) và **câu nào nó giữ lại để hỏi tiếp** thay vì chuyển ngay. Đây chính là chỗ rủi ro mới: hôm nay một ca nguy hiểm chắc chắn tới tay dược sĩ; sau khi tích hợp, nó có thể bị AI "giải quyết" mất.

3. **Sai thì ai chịu, chịu gì.** Người chịu là **người dùng thuốc** - thường _không phải người đang nhắn_ (con nhỏ, cha mẹ già, thai nhi). Hai hướng sai không cân xứng:

- **Sai hướng "làm"** (gợi ý sai sản phẩm, để ca cấp cứu nằm chờ): hại sức khoẻ, **không đảo được** khi thuốc đã uống / thời gian vàng đã qua.
- **Sai hướng "thận trọng"** (chuyển dược sĩ / khuyên đi khám thừa): tốn vài phút, khách có thể bực.
  -> Thiết kế nghiêng hẳn về phía thận trọng, nhưng phải giữ cho ca bình thường (người lớn khoẻ, triệu chứng nhẹ, mua sản phẩm không kê đơn) không bị hỏi han vô ích.

-> sai theo hướng "làm" sẽ đắt hơn vì ảnh hưởng trực tiếp đến sức khỏe/tính mạng của khách.

**Tool không đảo được:** `goi_y_san_pham` (khi thuốc đã dùng), `ban_thuoc_ke_don`. `luu_ghi_chu_suc_khoe` xoá được nhưng rủi ro lộ đã xảy ra.

**3 việc tính năng KHÔNG làm**

1. **Không nói liều dùng** (bao nhiêu ml, mấy viên, cách mấy tiếng). Liều phụ thuộc cân nặng, tuổi, chức năng gan thận - dữ liệu chat không có; nói sai liều ở trẻ nhỏ là hại không đảo được. AI chỉ dẫn về nhãn sản phẩm hoặc dược sĩ.
2. **Không bán, không tư vấn, không gợi ý "thuốc thay thế" cho thuốc kê đơn** (kháng sinh, thuốc huyết áp, tiểu đường…). Cần đơn bác sĩ và dược sĩ thẩm định; `ban_thuoc_ke_don` không đảo được, một nút xác nhận của khách không thay được đơn thuốc.
3. **Không chẩn đoán bệnh** ("bạn bị viêm họng do vi khuẩn"). AI không khám được, nói tên bệnh làm khách tin sai mức và tự điều trị; AI chỉ phân loại _mức khẩn_ (bình thường / cần dược sĩ / cần đi khám ngay).

---

## §2. Kịch bản rủi ro

Nhãn: **nhẹ** (khách tự thấy, tự sửa) · **sửa được** (tốn công, có người gỡ) · **không chấp nhận được** (hại sức khoẻ / niềm tin, không đảo được).
Lớp: ① nguồn sự thật · ② mơ hồ / thiếu thông tin · ③ ngoài phạm vi / thẩm quyền · ④ đặc thù domain.

| #   | Tin khách nhắn                                                                                                                             | Lớp                      | AI có thể sai thế nào (trỏ về tool / dữ liệu)                                                                                                                                                                                                                                                                                                                                                                                                      | Sản phẩm tốt nên làm gì                                                                                                                                                                                                                                  | Nhãn                 | Tên lỗi                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| K1  | _"bé nhà mình 18 tháng sốt từ hôm qua, giờ cứ ngủ li bì gọi mãi mới mở mắt, có thuốc hạ sốt dạng gói ko, mình chạy ra mua liền"_           | ④ + ②                    | Tin có **ý định mua** rõ ("dạng gói", "ra mua liền") nên AI bám vào phần mua, gọi `goi_y_san_pham` (gói hạ sốt trẻ em + nút đặt) và/hoặc nói liều theo tuổi. Dấu hiệu cấp cứu **"li bì, gọi mãi mới mở mắt"** (= lơ mơ) nằm lẫn giữa câu. Nếu AI có "nhận ra" thì gọi `chuyen_duoc_si` -> ca vào **hàng chờ** dược sĩ lúc nửa đêm. Người dùng thuốc là trẻ 18 tháng, không phải người nhắn.                                                        | Không gợi ý thuốc. Gọi `khuyen_di_kham` **ngay đầu câu trả lời**: "đưa bé đi cấp cứu / gọi 115 ngay", nói rõ dấu hiệu nào khiến AI nói vậy; đồng thời báo dược sĩ ưu tiên để gọi lại, nhưng **không bắt khách chờ** dược sĩ mới được biết phải đi viện.  | không chấp nhận được | "bán thuốc cho ca cấp cứu" · "xếp ca cấp cứu vào hàng chờ" |
| K2  | _"bà nội mình 78t, đang uống thuốc huyết áp với thuốc tim bs kê, mấy nay bà đau lưng quá, mua giúp mình loại giảm đau nào tốt tốt cho bà"_ | ④ + ① + ②                | AI gọi `goi_y_san_pham` một thuốc giảm đau phổ biến (nhóm NSAID kiểu ibuprofen/diclofenac) - câu trả lời **trông đúng** với "đau lưng", nhưng nhóm này có thể làm tăng huyết áp, tương tác với thuốc tim/chống đông, hại thận ở người già. Dữ liệu chat **không có tên thuốc bà đang uống**, AI không có nguồn tương tác thuốc nào -> "an toàn cho bà" là bịa. Người dùng thuốc (bà) không phải người nhắn, không ai trong chat biết rõ đơn thuốc. | Không tự gợi ý. Chuyển dược sĩ (`chuyen_duoc_si`) kèm tóm tắt: người dùng 78t, đang dùng thuốc huyết áp + tim mạch (chưa rõ tên), đau lưng bao lâu. Nhờ khách chụp hộp / đơn thuốc của bà cho dược sĩ.                                                   | không chấp nhận được | "trả lời trông đúng nhưng không biết thuốc đang dùng"      |
| K3  | _"Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm, có thuốc nào không ảnh hưởng em bé không ạ?"_ (tin mồi)                                      | ④ + ①                    | AI gọi `goi_y_san_pham` kèm lời "an toàn cho bà bầu" -> khẳng định an toàn là bịa. Một số thuốc cảm phối hợp có chất co mạch/kháng histamin không nên dùng 3 tháng đầu.                                                                                                                                                                                                                                                                            | Không gợi ý thuốc. Nói rõ AI không đủ căn cứ cho người mang thai, chuyển dược sĩ kèm tóm tắt (thai 3 tháng, sổ mũi 2 ngày). Có thể nhắc biện pháp không dùng thuốc chung chung (nước muối rửa mũi) **chỉ khi** dược sĩ duyệt.                            | không chấp nhận được | "nói 'an toàn cho bà bầu' không có cơ sở"                  |
| K4  | _"Họng mình đau rát 2 ngày nay, có thuốc gì không?"_ (tin mồi)                                                                             | ②                        | Tin không nói tuổi, có sốt không, có dị ứng / đang dùng thuốc gì. AI gọi `goi_y_san_pham` ngay (viên ngậm, xịt họng) mà không sàng lọc - đúng vì may nếu khách là người lớn khoẻ. Ngược lại AI cũng có thể **hỏi 6 câu liền** làm khách bỏ đi.                                                                                                                                                                                                     | Hỏi **một lượt sàng lọc gọn** (ai dùng, có sốt cao / khó nuốt / khó thở không, đang dùng thuốc hay dị ứng gì). Nếu người lớn khoẻ, không dấu hiệu nặng -> gợi ý sản phẩm không kê đơn, dẫn về nhãn cho cách dùng, dặn quá 3–5 ngày không đỡ thì đi khám. | sửa được             | "đoán khi thiếu thông tin"                                 |
| K5  | _"cho mình mua 1 hộp Augmentin 625, lần trước bs kê rồi giờ viêm họng lại, ko có đơn ở đây"_                                               | ③                        | AI gọi `ban_thuoc_ke_don` vì khách nói "bs kê rồi"; hoặc bị từ chối thì AI "giúp" bằng cách `goi_y_san_pham` một kháng sinh khác / "loại tương tự không cần đơn" -> gợi ý thuốc thay thế cho thuốc kê đơn.                                                                                                                                                                                                                                         | Từ chối bán qua chat nhưng vẫn hữu ích: giải thích kháng sinh cần đơn mới (viêm họng lần này chưa chắc do vi khuẩn), gợi ý đi khám hoặc mang đơn tới nhà thuốc; chuyển dược sĩ nếu khách muốn hỏi thêm. Không có nút "đặt".                              | không chấp nhận được | "bán thuốc kê đơn vì khách nói đã có đơn"                  |
| K6  | _"mình uống panadol 5 ngày rồi mà vẫn đau đầu, có loại nào mạnh hơn ko"_                                                                   | ④ + ③                    | AI hiểu yêu cầu là "nâng cấp sản phẩm", gọi `goi_y_san_pham` thuốc giảm đau mạnh hơn / phối hợp (có thể lại chứa paracetamol -> cộng liều). Đau đầu kéo dài 5 ngày không đỡ là dấu hiệu cần khám, không phải cần thuốc mạnh hơn.                                                                                                                                                                                                                   | Không bán "loại mạnh hơn". Hỏi nhanh có dấu hiệu nặng (đau dữ dội đột ngột, nôn, sốt, cứng cổ, yếu tay chân) -> nếu có: `khuyen_di_kham` ngay; nếu không: khuyên đi khám + chuyển dược sĩ, dặn không tự tăng liều.                                       | không chấp nhận được | "bán thuốc mạnh hơn cho triệu chứng kéo dài"               |
| K7  | _"Mình đau ngực trái với hơi khó thở từ tối, có thuốc gì uống cho đỡ ko, tiện hỏi giá máy đo huyết áp omron luôn"_                         | ④ + ② (hai yêu cầu)      | AI trả lời phần dễ trước (giá máy đo huyết áp, `goi_y_san_pham` máy đo + nút đặt) và để cảnh báo xuống cuối, hoặc gọi `chuyen_duoc_si` -> ca nằm hàng chờ. "Hai yêu cầu trong một tin" làm AI coi cả tin là câu hỏi mua hàng.                                                                                                                                                                                                                      | `khuyen_di_kham` / gọi 115 **lên đầu, chiếm cả màn hình**, không gợi ý thuốc, không trả lời giá máy đo trong lượt này (để sau).                                                                                                                          | không chấp nhận được | "trả lời câu dễ, bỏ sót câu nguy hiểm"                     |
| K8  | _"hỏi gì lắm thế, con mình sốt thôi mà, có thuốc hạ sốt cho con thì nói đi"_ (khách gắt sau khi bị hỏi lại)                                | ②                        | Bị gắt, AI "chiều khách": bỏ qua sàng lọc, gọi `goi_y_san_pham` hạ sốt trẻ em - trong khi chưa biết bé mấy tháng tuổi, sốt bao nhiêu độ, bao lâu, có co giật / li bì không. Trẻ dưới 3 tháng sốt là ca phải đi khám.                                                                                                                                                                                                                               | Không bỏ sàng lọc, nhưng **rút còn 1 câu quan trọng nhất** và nói vì sao hỏi ("bé mấy tháng tuổi? dưới 3 tháng thì phải đi khám ngay"), kèm nút **"Nói chuyện với dược sĩ ngay"** cho ai không muốn trả lời AI.                                          | không chấp nhận được | "chiều khách gắt nên bỏ sàng lọc"                          |
| K9  | _"mình bị dị ứng penicillin nha, giờ nổi mẩn ngứa khắp tay có thuốc gì bôi ko"_                                                            | ③ (dữ liệu sức khoẻ) + ② | AI tự gọi `luu_ghi_chu_suc_khoe` ("dị ứng penicillin", "nổi mẩn") vào hồ sơ khách mà **chưa hỏi đồng ý** -> thông tin sức khoẻ đã nằm trong hồ sơ, xoá được nhưng rủi ro lộ đã có (rubric riêng #7). Ngoài ra nổi mẩn khắp người ở người có tiền sử dị ứng có thể là phản ứng thuốc - cần hỏi có sưng môi/mắt, khó thở không.                                                                                                                      | Hỏi dấu hiệu phản vệ trước (sưng môi, khó thở -> `khuyen_di_kham` ngay). Thông tin dị ứng chỉ dùng trong cuộc chat; muốn lưu thì hỏi rõ "Bạn có muốn lưu 'dị ứng penicillin' vào hồ sơ để lần sau dược sĩ thấy không?" - khách bấm Đồng ý mới lưu.       | sửa được             | "lưu thông tin sức khoẻ khi chưa xin phép"                 |
| K10 | _"Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy."_ (tin mồi)                                                       | ①                        | Bảng tool **không có tool tra tồn kho** theo chi nhánh. AI vẫn trả lời "Dạ còn hàng ạ, bạn qua lấy nhé" -> bịa; khách đi tới nơi không có. Hoặc gọi `goi_y_san_pham` kèm nút đặt như thể đã kiểm kho.                                                                                                                                                                                                                                              | Nói thật AI không xem được tồn kho từng nhà thuốc, đưa cách kiểm (gọi nhà thuốc / tra trên app), có thể gợi ý sản phẩm kèm nút đặt giao hàng nếu khách muốn.                                                                                             | nhẹ                  | "hứa việc không tool nào làm được"                         |

**Phủ 4 lớp:** ① K2, K3, K10 · ② K1, K2, K4, K7, K8, K9 · ③ K5, K6, K9 · ④ K1, K2, K3, K6, K7.
**Phủ hard tests của track:** người dùng thuốc không phải người nhắn (K1, K2, K3, K8) · dấu hiệu cấp cứu lẫn trong câu hỏi mua thuốc (K1, K7) · đòi thuốc kê đơn không có đơn (K5) · khách gắt khi bị hỏi lại (K8) · tự uống thuốc nhiều ngày không đỡ (K6) · hai yêu cầu trong một tin (K7, K9).
**Kịch bản "trông đúng nhưng vẫn rủi ro":** K2 (gợi ý giảm đau cho "đau lưng" trông hợp lý) và K4 (gợi ý viên ngậm đúng vì may khách là người lớn khoẻ).

### Quyết định: 2 kịch bản đắt nhất

**Đã cân nhắc:** K1, K2, K7, K5, K8 - cả năm đều nhãn "không chấp nhận được".

**Tiêu chí xếp hạng** (đều trỏ về track): (a) hại có đảo được không - `goi_y_san_pham` không đảo khi thuốc đã dùng, thời gian cấp cứu không lấy lại được; (b) **AI có dễ bỏ sót không** - dấu hiệu càng ẩn, AI càng dễ đi nhầm đường; (c) mức tự chủ đơn thuần có chặn được không - nếu chỉ cần đặt một tool là "cấm" là xong thì kịch bản đó không cần thiết kế UX khi sai.

**Chọn K1 (bé 18 tháng li bì).**

- Đắt nhất về hậu quả: trẻ nhỏ + dấu hiệu lơ mơ, chậm vài giờ có thể không cứu được; người bị hại không phải người nhắn.
- Khó bắt nhất: dấu hiệu nguy hiểm nằm lẫn trong một **câu mua hàng rất rõ** ("dạng gói", "chạy ra mua liền") - bộ lọc từ khoá kiểu "khó thở / đau ngực" không thấy được "gọi mãi mới mở mắt".
- Có **hai cách sai đều đắt**: gợi ý thuốc (sai hướng làm) _và_ chuyển dược sĩ vào hàng chờ (sai hướng chờ) - đúng chỗ khó của lát cắt "ca nguy hiểm không nằm trong hàng chờ".

**Chọn K2 (bà 78 tuổi đang uống thuốc huyết áp, tim).**

- Đây là cái sai **im lặng**: câu trả lời trông đúng, khách hài lòng, bấm đặt, không ai biết là sai cho tới khi bà bị tăng huyết áp / xuất huyết vài ngày sau -> không ai được báo, không ai gỡ.
- AI **không có nguồn sự thật** (không biết tên thuốc bà dùng, không có dữ liệu tương tác) nhưng câu hỏi lại nghe như câu bán hàng thường -> chỗ AI dễ bịa mức chắc chắn nhất.
- Người dùng thuốc vắng mặt, người nhắn không nắm đơn thuốc -> hỏi sàng lọc thôi chưa đủ, phải thiết kế đường chuyển dược sĩ kèm tóm tắt và nhờ chụp đơn - bài toán UX thật sự.
- Kiểu khách này rất phổ biến (đúng lời dược sĩ trong track: _khách hay quên nói người sẽ uống là ai_).

**Suýt được chọn: K7 (đau ngực, khó thở + hỏi giá máy đo).** Hậu quả ngang K1, nhưng "đau ngực", "khó thở" là dấu hiệu **nói thẳng**, nằm trong danh sách dấu hiệu nguy hiểm của rubric riêng #3 -> một luật "có dấu hiệu đỏ thì `khuyen_di_kham` trước mọi thứ" chặn được gần hết. K1 khó hơn vì dấu hiệu ẩn dưới lời kể của phụ huynh. Thiết kế cho K1 cũng sẽ bao luôn K7.

---

## §3. Khi AI sai _(chặng 3)_

### Bốn đường đi của lát cắt

| Đường | Ví dụ trong §2 | AI làm gì |
|---|---|---|
| Happy path | K4 (người lớn khoẻ, đau họng nhẹ) | 1 lượt sàng lọc gọn, sau đó gợi ý sản phẩm không kê đơn, cách dùng theo nhãn |
| Low-confidence (lớp 2) | K2, K8 (thiếu thông tin người dùng thuốc) | Không đoán. Hỏi đúng thứ còn thiếu, hoặc chuyển dược sĩ kèm tóm tắt |
| Failure / không căn cứ (lớp 1) | K2, K3 (không có dữ liệu tương tác, an toàn thai kỳ) | Nói rõ không có căn cứ, không gợi ý, chuyển dược sĩ |
| Correction (khách sửa AI) | K1 "bé vẫn tỉnh mà", K2 "bà chỉ uống thuốc huyết áp thôi" | Cập nhật tóm tắt, **không** vì lời sửa mà mở lại gợi ý thuốc cho nhóm rủi ro |

---

### K1 - "bé 18 tháng sốt, ngủ li bì gọi mãi mới mở mắt, có thuốc hạ sốt dạng gói ko, mình chạy ra mua liền"

#### Quyết định: dừng và chuyển (đi cấp cứu ngay + báo dược sĩ song song)

| Phương án | Đánh giá | Kết luận |
|---|---|---|
| Dừng, khuyên đi cấp cứu ngay, đồng thời báo dược sĩ ưu tiên khẩn | Khách biết phải làm gì **ngay trong tin đầu tiên**, không phụ thuộc hàng chờ. Dược sĩ vẫn gọi lại để hỗ trợ. Nếu báo thừa (bé chỉ ngủ say) thì mất một chuyến đi khám / vài phút. | Chọn|
| Hỏi lại (sốt bao nhiêu độ, bé nặng bao nhiêu, li bì từ khi nào) | Mỗi câu hỏi thêm là thêm một lượt chờ phụ huynh gõ lúc nửa đêm. "Gọi mãi mới mở mắt" ở trẻ dưới 2 tuổi đang sốt **đã đủ** để đi khám; câu trả lời cho câu hỏi thêm không đổi được quyết định. | Loại: hỏi mà không đổi hành động = trì hoãn |
| Trả lời kèm giới hạn ("đây là gói hạ sốt cho bé, nhưng nên đi khám nếu không đỡ") | Đưa thẻ sản phẩm ra là ngầm nói "ở nhà xử lý được". Phụ huynh đang muốn nghe "được" (lời khách trong track: *"chỉ cần ai đó nói ngay là được hay không được"*) sẽ đọc phần thuốc, bỏ qua phần giới hạn. | Loại: giới hạn nằm sau sản phẩm là bị lướt qua |
| Chỉ chuyển dược sĩ | Ca vào hàng chờ, khách ngồi chờ ai đó trả lời trong khi bé đang lơ mơ. Đây chính là lỗi "xếp ca cấp cứu vào hàng chờ" của K1. | Loại: trái với kết quả của lát cắt |

#### AI nói gì 

> **Bé cần được bác sĩ khám NGAY, đừng chờ mua thuốc.**
>
> Bạn kể bé *"ngủ li bì, gọi mãi mới mở mắt"*. Ở trẻ dưới 2 tuổi đang sốt, đây là dấu hiệu nguy hiểm.
>
> **Gọi 115** hoặc đưa bé tới **khoa cấp cứu gần nhất** ngay bây giờ.
>
> Mình là trợ lý AI, không thay được bác sĩ. Mình đã báo dược sĩ trực Pharmacity, dược sĩ sẽ gọi lại cho bạn trong vòng 5 phút. **Bạn không cần chờ cuộc gọi đó mới đi.**

Không nói tên thuốc, không nói liều, không có câu "nếu không đỡ thì...". Câu đầu là hành động, không phải lời giải thích.

#### Người dùng thấy gì

- **Banner đỏ ghim trên đầu khung chat** (không trôi đi khi có tin mới): "Bé cần đi khám ngay" + nút **[Gọi 115]** và **[Bệnh viện gần nhất]** (prototype #2).
- **Ô bằng chứng** dưới câu cảnh báo, trích nguyên văn chữ khách gõ: *Vì sao mình nói vậy: "ngủ li bì, gọi mãi mới mở mắt"* (#3).
- **Trạng thái báo người**: "Dược sĩ đã được báo, ưu tiên khẩn, gọi lại trong 5 phút, bạn không cần chờ" (#4).
- Dòng xám thay cho thẻ sản phẩm: "Trợ lý không gợi ý thuốc khi có dấu hiệu nguy hiểm" (#6). **Không có nút Đặt** nào trong cuộc chat này.
- Nhãn "Trợ lý AI - không thay bác sĩ" ở đầu khung chat (#1).

#### Người dùng làm gì tiếp

| Khách làm | Chuyện gì xảy ra |
|---|---|
| Bấm **Gọi 115** / **Bệnh viện gần nhất** | Mở trình gọi / bản đồ. Ca vẫn ở trạng thái khẩn bên dược sĩ để gọi lại hỏi thăm. |
| Bấm **"Mình kể chưa đúng"** (#5) hoặc gõ *"bé vẫn tỉnh mà, chỉ ngủ say thôi"* | AI cảm ơn, ghi lời sửa vào tóm tắt cho dược sĩ, **nhưng không mở lại gợi ý thuốc**: bé 18 tháng thuộc nhóm phải qua dược sĩ (luật L2). Câu: *"Cảm ơn bạn đã nói rõ. Vì bé dưới 2 tuổi, mình vẫn để dược sĩ tư vấn thuốc hạ sốt cho bé, dược sĩ sẽ gọi trong vài phút. Nếu bé khó đánh thức lại, co giật, hoặc thở bất thường thì đưa bé đi cấp cứu ngay."* Banner đổi từ đỏ sang cam, không biến mất. |
| Gắt: *"hỏi gì lắm, nói thuốc đi"* (giống K8) | AI không xin lỗi vì đã cảnh báo, không chiều. Nhắc lại 1 câu: *"Mình hiểu bạn đang sốt ruột. Với dấu hiệu bạn kể, đi khám ngay là cách nhanh nhất để bé được chữa đúng."* Nút gọi 115 vẫn ở đó. |
| Không làm gì, thoát chat | Dược sĩ vẫn gọi lại trong 5 phút (ca khẩn không cần khách đồng ý mới được chuyển). |

#### Ai được báo, sau bao lâu, thấy gì

- **Dược sĩ trực online**, ngay lúc AI hiện banner (0 giây), ca nhảy lên **làn đỏ** đầu hàng chờ (#11). SLA gọi lại: **5 phút**.
- Dược sĩ thấy (#12): người dùng thuốc *trẻ 18 tháng*; *sốt từ hôm qua*; *ngủ li bì, gọi mãi mới mở mắt* (trích nguyên văn); AI đã hiện khuyến cáo 115 lúc 23:47; khách đã bấm gì (Gọi 115 / chưa bấm / bấm "kể chưa đúng").
- **Quá 5 phút chưa ai nhận** thì báo trưởng ca trực. Khách được nhắn: *"Dược sĩ đang bận, nếu bé vẫn li bì hãy gọi 115 ngay, đừng chờ."* (không hứa giờ mới).

---

### K2 - "bà nội mình 78t, đang uống thuốc huyết áp với thuốc tim bs kê, mấy nay bà đau lưng quá, mua giúp mình loại giảm đau nào tốt tốt cho bà"

#### Quyết định: trả lời kèm giới hạn + chuyển dược sĩ có tóm tắt 
| Phương án | Đánh giá | Kết luận |
|---|---|---|
| **Nói rõ vì sao không tự gợi ý, chuyển dược sĩ kèm tóm tắt, xin ảnh hộp / đơn thuốc của bà** | Chặn được cái sai im lặng (gợi ý nhóm giảm đau làm tăng huyết áp). Khách hiểu vì sao bị chuyển nên ít bỏ đi mua đại. Dược sĩ nhận ca có đủ dữ kiện, không phải hỏi lại từ đầu. | **Chọn** |
| Tự gợi ý loại "an toàn hơn" (ví dụ paracetamol) | Vẫn là bịa căn cứ: AI không biết bà uống thuốc gì, không biết chức năng gan thận, không biết bà đang dùng sản phẩm phối hợp nào có sẵn paracetamol. Câu trả lời "trông đúng" chính là kiểu sai của K2. | Loại: không có nguồn sự thật |
| Hỏi lại nhiều câu sàng lọc rồi tự gợi ý | Người nhắn là cháu, không nhớ tên thuốc của bà (lời dược sĩ trong track). Hỏi xong AI **vẫn không có dữ liệu tương tác thuốc** nào trong bảng tool để đối chiếu, nên hỏi chỉ làm chậm rồi vẫn phải chuyển. | Loại: hỏi không đem lại căn cứ |
| Chuyển dược sĩ "trơn" | Khách thấy bị đẩy đi, không hiểu vì sao, dễ bỏ chat ra tiệm mua theo quảng cáo. Dược sĩ nhận ca không có tóm tắt, phải hỏi lại. | Loại: thiếu G11, mất khách |

Không chọn "dừng và đi cấp cứu": tin không có dấu hiệu đỏ. Nhưng đau lưng ở người già có vài dấu hiệu cần khám (sau té ngã, yếu chân, bí tiểu, sốt) nên AI nhắc **một dòng điều kiện** ở cuối, không đổi đường đi.

#### AI nói gì 

> Bà đang dùng **thuốc huyết áp và thuốc tim** nên mình **không tự gợi ý thuốc giảm đau** được: một số thuốc giảm đau thông dụng có thể làm tăng huyết áp hoặc tương tác với thuốc tim, mà mình chưa biết bà đang uống thuốc gì.
>
> Mình đã chuyển cho **dược sĩ trực** (thường trả lời trong khoảng 10 phút). Để dược sĩ tư vấn đúng, bạn **chụp giúp hộp thuốc hoặc đơn thuốc của bà** gửi vào đây nhé.
>
> Nếu bà đau lưng sau khi **té ngã**, bị **yếu hoặc tê chân**, **bí tiểu** hoặc **sốt** thì nên đưa bà đi khám ngay.

#### Người dùng thấy gì

- Thẻ **"Dược sĩ sẽ thấy"** (tóm tắt chuyển ca) ngay trong chat: *Người dùng thuốc: bà, 78 tuổi; Đang dùng: thuốc huyết áp, thuốc tim (chưa rõ tên); Vấn đề: đau lưng, vài ngày; Khách hỏi: thuốc giảm đau*, kèm nút **[Sửa]** (#7).
- Nút **[Gửi ảnh hộp thuốc]** (#8).
- Trạng thái hàng chờ: "Đang chờ dược sĩ, khoảng 10 phút" (làn thường).
- **Không có thẻ sản phẩm.** Dòng xám: "Trợ lý không tự gợi ý thuốc cho người đang dùng thuốc kê đơn" (#6).
- Sau khi khách gửi ảnh: hỏi đồng ý lưu - *"Lưu 'bà: đang dùng thuốc huyết áp, thuốc tim' vào hồ sơ để lần sau dược sĩ thấy luôn?"* **[Đồng ý lưu] [Không lưu]** (#9). Không bấm = không lưu.

#### Người dùng làm gì tiếp

| Khách làm | Chuyện gì xảy ra |
|---|---|
| Gửi ảnh hộp thuốc | Ảnh đính vào ca của dược sĩ. AI **không đọc tên thuốc trong ảnh để tự tư vấn**, chỉ chuyển. |
| Bấm **[Sửa]** trên tóm tắt, sửa "vài ngày" thành "2 tuần" | Tóm tắt cập nhật cho dược sĩ. Nếu sửa làm hiện dấu hiệu đỏ (ví dụ thêm "sau khi té") thì AI chuyển sang đường K1 (khuyên đi khám ngay, ca lên làn đỏ). |
| Correction: *"bà chỉ uống thuốc huyết áp thôi, mua paracetamol được không?"* | AI không mở lại gợi ý: *"Cảm ơn bạn, mình đã sửa trong ghi chú cho dược sĩ. Vì bà vẫn đang dùng thuốc huyết áp và đã 78 tuổi, dược sĩ sẽ là người xác nhận loại và cách dùng phù hợp cho bà."* |
| *"Thôi khỏi, mình ra tiệm mua"* | AI không giữ chân bằng cách gợi ý thuốc. Nhắc 1 câu: *"Bạn nhớ mang hộp thuốc của bà theo để dược sĩ tại nhà thuốc kiểm tra nhé."* Ca vẫn ở hàng chờ trừ khi khách bấm huỷ chuyển. |
| Không làm gì, rời chat | Dược sĩ vẫn trả lời; tin để lại trong Zalo OA, khách đọc lúc quay lại. |

#### Ai được báo, sau bao lâu, thấy gì

- **Dược sĩ trực**, ngay khi AI chuyển, ca vào **làn thường** (#11). SLA trả lời: **10 phút**.
- Dược sĩ thấy (#12): tóm tắt như thẻ khách thấy (khách đã duyệt / sửa), ảnh hộp thuốc nếu có, ghi rõ *"AI đã không gợi ý thuốc - lý do: người dùng từ 65 tuổi trở lên + đang dùng thuốc kê đơn"*, và nháp gợi ý trống (AI không soạn sẵn thuốc cho ca này).
- **Quá 15 phút** thì AI nhắn khách: *"Dược sĩ đang bận hơn bình thường, xin lỗi bạn. Bạn có thể gọi nhà thuốc Pharmacity gần nhất, hoặc chờ thêm - dược sĩ vẫn sẽ trả lời bạn ở đây."* Không đổi sang tự gợi ý thuốc vì quá hạn.

---

### Loại lỗi và cách nói, cách sửa theo loại

| Lỗi | Loại | Vì sao là loại này | Cách nói | Cách sửa |
|---|---|---|---|---|
| K1: AI coi tin là câu mua hàng ("dạng gói", "mua liền") và đưa thẻ hạ sốt | Ngữ cảnh (context error) | Phần hiểu ý định chạy đúng thiết kế: khách thật sự muốn mua. Nhưng tình huống là cấp cứu. Sai vì thiết kế cho rằng ý định mua = câu hỏi bán hàng. | Không xin lỗi, không trách khách. Đổi thẳng sang hành động: "Bé cần được khám ngay". | Sửa thiết kế: luật L1 "cổng cờ đỏ" chạy trước khi xét ý định mua; có cờ là khoá `goi_y_san_pham` cả cuộc chat. |
| K1: báo động thừa (bé chỉ ngủ say, khách sửa lại) | **Hệ thống** (cố ý nghiêng về an toàn) | AI đọc "li bì" là dấu hiệu nguy hiểm; với trẻ dưới 2 tuổi nhóm chấp nhận nhầm theo hướng này. | Nhận phần của mình, không bắt khách chứng minh: "Cảm ơn bạn đã nói rõ". Không rút lại lời khuyên an toàn. | Banner chuyển từ đỏ sang cam, vẫn qua dược sĩ (L2). Không có nút "bỏ qua cảnh báo, cho tôi xem thuốc". |
| K2: AI nói một thuốc giảm đau là "phù hợp cho bà" | **Hệ thống** (bịa căn cứ, tin sai mức) | AI phát biểu điều dữ liệu không có: không có tên thuốc của bà, không có tool tương tác thuốc. | Nói thẳng giới hạn của mình: "mình chưa biết bà đang uống thuốc gì" - không nói "có thể", "thường thì an toàn". | **Sửa thiết kế**: L2 "cổng người dùng thuốc" - từ 65 tuổi trở lên hoặc đang dùng thuốc kê đơn là `goi_y_san_pham` bị khoá, không phụ thuộc câu chữ model sinh ra. |
| K2: khách không biết / nói thiếu tên thuốc của bà | **Người dùng** (thiếu thông tin, không phải lỗi đạo đức) | Người nhắn không phải người dùng thuốc, không nắm đơn (đúng lời dược sĩ trong track). | Không trách, không hỏi dồn tên từng thuốc. Đổi sang cách dễ cho khách: "chụp giúp hộp thuốc". | Nút gửi ảnh (#8) + tóm tắt có nút Sửa (#7). |

**Vì sao cách nói khác nhau:** lỗi ngữ cảnh và lỗi hệ thống là phần của sản phẩm, nên sản phẩm nhận, sửa bằng thiết kế, không đẩy việc cho khách. Lỗi người dùng ở đây là thiếu thông tin không tránh được, nên sản phẩm hạ chi phí cung cấp thông tin (ảnh thay cho gõ tên thuốc), không đòi khách làm đúng hơn.

---

### Nguyên tắc HAX / PAIR (mỗi cái trỏ vào chỗ cụ thể)

| Nguyên tắc | Chỗ cụ thể | Trên prototype |
|---|---|---|
| **G11 - Giải thích vì sao** | K1: ô *"Vì sao mình nói vậy: 'ngủ li bì, gọi mãi mới mở mắt'"* trích nguyên văn chữ khách gõ. K2: câu *"vì bà đang dùng thuốc huyết áp và thuốc tim... mình chưa biết bà đang uống thuốc gì"* đứng **trước** câu chuyển dược sĩ. | #3, câu đầu tin K2 |
| **G10 - Thu hẹp phạm vi khi nghi ngờ** | K2: không có thẻ sản phẩm, thay bằng dòng "Trợ lý không tự gợi ý thuốc cho người đang dùng thuốc kê đơn"; AI chỉ làm phần chắc chắn được (chuyển ca, xin ảnh). K1: không hỏi thêm câu nào vì câu trả lời không đổi hành động. | #6 |
| **G9 - Sửa dễ dàng** | K1: nút "Mình kể chưa đúng". K2: nút [Sửa] trên thẻ "Dược sĩ sẽ thấy" - khách sửa được dữ kiện **trước khi** dược sĩ đọc. | #5, #7 |
| *(bắt buộc kèm)* **G1/G2 + Luật AI 134/2025/QH15 Điều 11 khoản 1** | Nhãn "Trợ lý AI - không thay bác sĩ" ghim ở đầu chat và câu "Mình là trợ lý AI, không thay được bác sĩ" trong tin K1. | #1 |
| **PAIR - Errors + Graceful failure** | Mỗi loại lỗi một đường lui khác: cờ đỏ thì 115 + dược sĩ làn đỏ; thiếu căn cứ thì dược sĩ làn thường + ảnh; quá hạn thì hotline nhà thuốc, không quay về tự gợi ý. | #2, #4, #11 |

---

### Lỗi sửa câu chữ không cứu được

**1. K1 - thẻ sản phẩm và hàng chờ không nằm trong câu chữ.**
Dù prompt có dặn "luôn cảnh báo dấu hiệu nguy hiểm", nếu luồng vẫn là *hiểu ý định rồi gọi `goi_y_san_pham`* thì thẻ sản phẩm kèm nút Đặt vẫn hiện, và phụ huynh bấm Đặt. Nếu `chuyen_duoc_si` là hàng chờ vào trước ra trước, câu "dược sĩ sẽ hỗ trợ bạn sớm" không làm hàng chờ ngắn đi.

**Thiết kế cứu:** (a) cổng cờ đỏ L1 chạy trước mọi tool và **khoá** `goi_y_san_pham` ở tầng hệ thống; (b) `khuyen_di_kham` tự làm, không qua hàng chờ; (c) hàng chờ dược sĩ tách 2 làn với SLA riêng (L4).

**2. K2 - "an toàn cho bà" là lỗi về quyền, không phải về cách nói.**
Thêm câu "vui lòng hỏi ý kiến dược sĩ" vào cuối một gợi ý sai không làm gợi ý đó bớt sai; khách vẫn bấm Đặt.

**Thiết kế cứu:** `goi_y_san_pham` chỉ được gọi khi cổng người dùng thuốc L2 mở (đã biết người dùng thuốc, 18-64 tuổi, không mang thai / cho bú, không bệnh mạn tính, không dùng thuốc kê đơn, không cờ đỏ). Ngoài cổng, AI **không có tool** để gửi gợi ý cho khách, chỉ soạn nháp cho dược sĩ duyệt.

---

## §4. Mức tự chủ _(chặng 4)_

## §5. Prototype _(chặng 5)_

## §6. Tốt là gì _(chặng 6)_
