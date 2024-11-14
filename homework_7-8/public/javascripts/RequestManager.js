class RequestManager {
  static async postRequest(route, body) {
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
  }

  static async deleteRequest(route, body) {
    const response = await fetch(route, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    console.log('------ data');
    console.log(data);
    window.location.reload(true)
    return data
  }

  static handleFileSelect(event, imgSelector) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const imgElement = document.querySelector(imgSelector)
        imgElement.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}
// export default RequestManager

// export default RequestManager - не потрібний у випадку якщо ми просто підключаємо його на стороні клієнта як звичайний JS файл оскільки ми нічого не експортуємо.