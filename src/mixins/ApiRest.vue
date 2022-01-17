<script>
export default {
  methods: {
    getInfo(param,page = 1) {
      var Urlbase = "http://127.0.0.1:8000/api/" + param +'?page=' + page;

      return fetch(Urlbase, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let response = res;
          //console.log("RTA: ",response)
          return response;
        })
        .catch((error) => console.log("error fetch", error));
    },
    addElement(param,bodyElement){
      let Urlbase = "http://127.0.0.1:8000/api/" + param;
      // console.log(JSON.stringify(bodyElement))
      return fetch(Urlbase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyElement)
      })
      .then(res => res.json())
      .then(res => {
        let response = res;
        return response;
      })
      .catch(error => console.log("error fetch", error));
    },
    deleteElement(param,id){
      var Urlbase = "http://127.0.0.1:8000/api/" + param + '/' + id;
      return fetch(Urlbase, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let response = res;
          return response;
        })
        .catch((error) => console.log("error fetch", error));
    },
    editElement(param,id,data){
      var Urlbase = "http://127.0.0.1:8000/api/" + param + '/' + id;
      return fetch(Urlbase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((res) => {
          let response = res;
          return response;
        })
        .catch((error) => console.log("error fetch", error));
    },
    getElementById(param,id){
      var Urlbase = "http://127.0.0.1:8000/api/" + param + '/' + id;
      return fetch(Urlbase, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let response = res;
          return response;
        })
        .catch((error) => console.log("error fetch", error));
    },
    dataBetweenDates(param,startDate,endDate){
      let Urlbase = "http://127.0.0.1:8000/api/" + param + '/' +  startDate + '/' + endDate;
      return fetch(Urlbase, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(res => res.json())
      .then(res => {
        let response = res;
        return response;
      })
      .catch(error => console.log("error fetch", error));
    }
  }
};
</script>
