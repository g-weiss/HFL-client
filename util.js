
const callApi = async ({ url, method, token, body }) => {
    // console.log("callApi: ", { url, method, token, body });
    try {
      const options = {
        method: method ? method.toUpperCase() : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`
      }
      // console.log("request url: ", BASE_URL + url)
      // console.log("options: ", options)
      const response = await fetch(`${url}`, options)
    //   const data = await response.json()
      // console.log("data: ", data)
      if (data.error) throw data.error
      return data
    } catch (error) {
      console.error("ERROR: ", error)
      return error
    }
  }

export {
    callApi
}