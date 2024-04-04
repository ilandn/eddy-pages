import servicesConfig from "./config";
import { authHeader } from "../_helpers";

export const userService = {
  login,
  logout,
  register,
  updateAnswer,
  getById,
  update,
  play,
};

function play() {
  var xhttp = new XMLHttpRequest();
  var token = localStorage.getItem("token");
  if (token === null) return Promise.reject(0);
  try {
    xhttp.open("GET", `https://api.eddygames.net/eddy/api/play`, false);
    xhttp.setRequestHeader("x-auth-token", token);
    xhttp.send();

    var q;
    if (xhttp.status === 200) {
      var obj = JSON.parse(xhttp.responseText);
      return Promise.resolve(obj);
    } else return Promise.reject(xhttp.status);
  } catch (error) {
    return Promise.reject(error);
  }
}

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    //body: JSON.stringify({ username, password })
    body: JSON.stringify({ username: username, password: password }),
    //body: JSON.stringify({"username": "Amit", "password": "Ed123456!"})
  };

  //return fetch(`http://localhost:8080/users/authenticate`, requestOptions)
  //	return fetch(`http://54.145.214.70:8080/eddy/eddy/api/login`, requestOptions)
  //        .then(handleResponse)
  //       .then(user => {
  // login successful if there's a jwt token in the response
  //            if (user.token) {

  // store user details and jwt token in local storage to keep user logged in between page refreshes
  //                localStorage.setItem('user', JSON.stringify(user));
  //            }

  //            return user;
  //        });
  var xhttp = new XMLHttpRequest();

  xhttp.open("POST", `https://api.eddygames.net/eddy/api/login`, false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //xhttp.send('{"username": "Amit", "password": "Ed123456!"}');
  xhttp.send(JSON.stringify({ username: username, password: password }));

  var token;
  if (xhttp.status === 200) {
    token = xhttp.getResponseHeader("x-auth-token");
    localStorage.setItem("user", JSON.stringify(username));
    localStorage.setItem("token", token);
    return Promise.resolve({ user: "username", token: token });
  } else return Promise.reject(xhttp.status);
}

function updateAnswer(answer) {
  var token = localStorage.getItem("token");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-auth-token": token },
    body: JSON.stringify(answer),
  };

  return fetch(
    `https://api.eddygames.net/eddy/api/question/answer`,
    requestOptions
  ).then(handleResponse);
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`https://api.eddygames.net/users`, requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`https://api.eddygames.net/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`https://api.eddygames.net/users/register`, requestOptions).then(
    handleResponse
  );
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`https://api.eddygames.net/users/${user.id}`, requestOptions).then(
    handleResponse
  );
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  return fetch(`https://api.eddygames.net/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
