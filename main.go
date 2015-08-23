package main

import (
	"net/http"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

func home(w http.ResponseWriter, r *http.Request) {
	r.Header.Set("Content-Type", "text/html")
	http.ServeFile(w, r, "public/home.html")
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", home)

	n := negroni.Classic()
	n.UseHandler(router)
	n.Run(":8080")
}
