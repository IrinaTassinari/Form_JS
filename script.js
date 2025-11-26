// переменные формы регистрации и cookies 
const form = document.querySelector('.form')
const inputName = document.querySelector('.inputName')
const inputEmail = document.querySelector('.inputEmail')
const inputPhone = document.querySelector('.inputPhone')
const inputCompany = document.querySelector('.inputCompany')
const button = document.querySelector('.btn')
const loginBtn = document.querySelector('.loginBtn')
const msg = document.createElement('p')
msg.className = 'message'
const cookiesSection = document.querySelector('.cookies-section')
const acceptBtn = document.querySelector('.accept-btn')
const rejectbtn = document.querySelector('.reject-btn')

//переменные формы Login
const loginForm = document.querySelector('.formIn')
const loginInput = document.querySelector('.emailIn')
const loginPassword = document.querySelector('.passwordIn')
const loginButton = document.querySelector('.btnIn')
const loginMsg = document.createElement('p')
loginMsg.classList.add=('message')


const users = localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users'))
    : []


// Функция в которой заложена логика вывода ошибки пустого или неправильно заполненного поля
const msgFn = (msgText, ok = false) => {
    msg.textContent = msgText
    msg.style.color = ok ? 'green' : 'red'//Если ok === true → цвет зелёный. Если ok === false → цвет красный.
}

const loginMsgFn = (msgText, ok = false) => {
    loginMsg.textContent = msgText
    loginMsg.style.color = ok ? 'green' : 'red'
}


// Функция проверки Email на наличие "@"
function isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
}
///\S+@\S+\.\S+/
    //    / ... / — запись регулярного выражения.
    //   \S — «не пробельный символ» (любая буква, цифра, знак, кроме пробела).
    //   + — «один или более» таких символов.
    //   @ — буква @ (сам символ собаки).
    //   \. — точка (нужен обратный слэш, чтобы точка не означала «любой символ»).
    //Всё вместе означает: (одна или больше не-пробельных) + @ + (одна или больше не-пробельных) + . + (одна или больше не-пробельных)
// Важно:
// Это лишь простая проверка.
// Настоящий формат e-mail сложнее (есть поддомены, спецсимволы и т.д.),
// но для быстрой базовой валидации такой шаблон подходит.


// прячем форму регистрации, выводим форму входа и очищаем ошибки
const showLogin = (email) => {
    form.style.display = 'none'
    loginForm.style.display = 'block'
    msgFn('', true)
    loginMsgFn('', true)
}
// здесь можно и false написать, суть не поменяется
    // Поскольку текста нет, цвет фактически не важен — текста всё равно не видно.




form.addEventListener('submit', (event) => {
    event.preventDefault()  // используется для отмены действия по умолчанию, которое обычно выполняется в ответ на определенное событие
    document.body.append(msg)

    // проверка на пустые строки и пробелы
    const nameTrim = inputName.value.trim()
    const emailTrim = inputEmail.value.trim()
    const phoneTrim = inputPhone.value.trim()
    const passwordTrim = inputCompany.value.trim()

     // проверяем заполнены ли все input, если нет выводим ошибку
    if (!nameTrim || !emailTrim || !phoneTrim || !passwordTrim) {
        msgFn('All field are required')
        return
    }

    // вывод ошибки после проверки на @ поле email
    if (!isEmailValid(emailTrim)) {
        msgFn('Email is invalid')
        return
    }


     // проверка зарегистрирован ли уже такой email и вывод ошибки(мы до этого сами ввели/создали аккаунты и занесли в хранилище)
    const isEmailExists = users.some((item) => {//Если хотя бы один объект в users имеет email равный emailTrim, . some() сразу вернёт true. Если хотя бы один пользователь с таким email найден →isEmailExists === true, выводим сообщение и прерываем дальнейший код.
        return item.email === emailTrim
    })
    if (isEmailExists) {
        msgFn('User with this email already exists')
        return
    }
    if (!/^\+\d{8,12}$/.test(inputPhone.value.trim())) {
    msgFn('Телефон должен начинаться  с + и должен содержать от 8 до 12 цифр')
    return
  }

     // добавляем введенные данные из inputов в массив
    users.push({
        name: nameTrim,
        email: emailTrim,
        phone: phoneTrim,
        password: passwordTrim
    })

      // скидываем массив в Localstorage
    localStorage.setItem('users', JSON.stringify(users))
    msgFn('Registered successfully', true)

    // сбрасываем форму
    form.reset()
    // вызваем функцию подмены формы на Login
    showLogin(emailTrim) //почему emailTrim????
})


loginBtn.addEventListener('click', () => {
    showLogin // всё очистили
})

// Login
loginForm.addEventListener('submit', (event) =>{
    event.preventDefault()
    document.body.append(loginMsg)

    const loginInputTrim = loginInput.value.trim()
    const passwordInputTrim = loginPassword.value.trim()

    if (!loginInputTrim || !passwordInputTrim) {
        loginMsgFn('All fields are required')
        return
    }

    if (!isEmailValid(loginInputTrim)){
        loginMsgFn('Email is invalid')
        return
    }

    const user = users.find((item) => {
        return item.email === loginInputTrim && item.password === passwordInputTrim
    })

    if (!user) {
        loginMsgFn('Password or email is incorrect')
        return
    }

    loginForm.style.display = 'none'
    loginMsgFn(`Welcome ${user.name}`, true)
    loginForm.reset()

    document.body.innerHTML = "";
    const btnLogout = document.createElement("button");
    btnLogout.innerText = "Logout";
    document.body.append(btnLogout);
})



//Почему именно find, а не some
// .some даёт только true/false, но не сам объект.
// Для приветствия вам нужны данные пользователя (например, name).
// .filter возвращает массив всех совпадений, что лишнее — нужен только один.
// .find — оптимальный выбор: быстро находит первый подходящий объект и возвращает его


acceptBtn.addEventListener('click', () =>{
    cookiesSection.remove()
})

