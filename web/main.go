package web

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/user"
	"google.golang.org/appengine/log"
	"fmt"
)

func init() {
	//tmpl, err := template.ParseGlob("templates/*.tmpl.html")
	//if err != nil {
	//	http.Handle("/", errHandler(err.Error(), http.StatusInternalServerError))
	//	return
	//}
	//http.Handle("/questions/", templateHandler(tmpl, "question"))
	//http.Handle("/", templateHandler(tmpl, "index"))

	//TODO find a way to define a regex ( idea : use gorilla )
	http.Handle("/admin", adminRemoteHandler())
	http.Handle("/admin/", adminRemoteHandler())
}


// remember that http.HandlerFunc is a valid http.Handler too
func adminRemoteHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		log.Debugf(ctx, "adminHandler, url %s", r.URL.Path)

		u := user.Current(ctx)

		if u != nil {
			log.Debugf(ctx, "adminHandler, is admin ? %s, email %s", u.Admin, u.Email)

			if !u.Admin {
				log.Debugf(ctx, "adminHandler, restricted access")
				fmt.Fprintf(w, `<h1>This is a restricted area</h1>`)
				return
			}
		} else {
			log.Debugf(ctx, "adminHandler, no user")
			//url, _ := user.LoginURL(ctx, "dist/index.html")
			url, _ := user.LoginURL(ctx, "admin")
			fmt.Fprintf(w, `<a href="%s">Sign in or register</a>`, url)
			return
		}

		log.Debugf(ctx, "adminHandler, serve index.html")

		http.ServeFile(w, r, "dist/index.html")

		log.Debugf(ctx, "adminHandler, DONE")

	})

}

//func templateHandler(tmpl *template.Template, name string) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		ctx := appengine.NewContext(r)
//		if ok := ensureUser(ctx, w, r); !ok {
//			return
//		}
//		err := tmpl.ExecuteTemplate(w, name, nil)
//		if err != nil {
//			http.Error(w, err.Error(), http.StatusInternalServerError)
//		}
//	})
//}
//
//// errHandler gets an http.Handler that reports the specified
//// error.
//func errHandler(err string, code int) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		http.Error(w, err, code)
//	})
//}
//
//// ensureUser makes sure a user is logged in, or redirects the the
//// login page.
//// Returns true if a user is logged in.
//func ensureUser(ctx context.Context, w http.ResponseWriter, r *http.Request) bool {
//	me := user.Current(ctx)
//	if me == nil {
//		loginURL, err := user.LoginURL(ctx, r.URL.Path)
//		if err != nil {
//			http.Error(w, err.Error(), http.StatusInternalServerError)
//			return false
//		}
//		http.Redirect(w, r, loginURL, http.StatusTemporaryRedirect)
//		return false
//	}
//	return true
//}

//// remember that http.HandlerFunc is a valid http.Handler too
//func staticAdminHandler(handler http.Handler) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		ctx := appengine.NewContext(r)
//		log.Debugf(ctx, "staticAdminHandler")
//
//		u := user.Current(ctx)
//
//		if u != nil {
//			log.Debugf(ctx, "authHandler, is admin ? %s, email %s", u.Admin, u.Email)
//		}
//
//		handler.ServeHTTP(w, r)
//	})
//}