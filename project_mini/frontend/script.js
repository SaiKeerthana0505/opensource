function openLogin(page = '') {
  const loginPopup = document.createElement('div');
  loginPopup.innerHTML = `
      <div class="login-overlay">
          <div class="login-box">
              <h2>Login</h2>
              <form action="${page}.html" method="get">
                  <label for="userid">User ID</label>
                  <input type="text" id="userid" name="userid" required>
                  <label for="password">Password</label>
                  <input type="password" id="password" name="password" required>
                  <div class="button-container">
                      <button type="submit" class="eco-btn">Login</button>
                      <button type="button" class="eco-btn" onclick="closeLogin()">Cancel</button>
                  </div>
              </form>
          </div>
      </div>
  `;
  document.body.appendChild(loginPopup);
}

function closeLogin() {
  document.querySelector('.login-overlay').remove();
}
