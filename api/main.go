package api

import (
	"io"
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"errors"
	"strings"
	"github.com/wuman/firebase-server-sdk-go"
)

func init() {

	http.HandleFunc("/", corsHandler(handleHello))
	http.HandleFunc("/api/login/", corsHandler(HandleLogin))
	//http.HandleFunc("/api/questions/", corsHandler(handler.HandleQuestions))
	//http.HandleFunc("/api/answers/", corsHandler(handler.HandleAnswers))
	//http.HandleFunc("/api/votes/", corsHandler(handler.HandleVotes))

	//meetings
	http.HandleFunc("/api/meeting/", corsHandler(HandleMeeting))
	http.HandleFunc("/api/meetings/", corsHandler(HandleMeeting))

	//coach
	http.HandleFunc("/api/coachs/", corsHandler(HandleCoachs))

	//coachee
	http.HandleFunc("/api/coachees/", corsHandler(HandleCoachees))
}

func handleHello(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle hello, for url %s", r.URL.Path)

	io.WriteString(w, "Hello from App Engine")
}

func corsHandler(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		ctx := appengine.NewContext(r)

		log.Debugf(ctx, "corsHandler start")

		//handle preflight in here
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

		//check token validity

		if (r.Method == "OPTIONS") {
			log.Debugf(ctx, "corsHandler, handle OPTIONS")

			w.WriteHeader(http.StatusOK)
		} else {
			log.Debugf(ctx, "corsHandler, handle all requests")

			token := r.Header.Get("Authorization")
			log.Debugf(ctx, "corsHandler auth token: %s", token)

			// If the token is empty...
			if token == "" {
				// If we get here, the required token is missing
				RespondErr(ctx, w, r, errors.New("invalid token"), http.StatusUnauthorized)
				return
			}

			//read the Bearer param
			if len(token) >= 1 {
				token = strings.TrimPrefix(token, "Bearer ")
			}

			log.Debugf(ctx, "corsHandler token: %s", token)

			// If the token is empty...
			if token == "" {
				// If we get here, the required token is missing
				RespondErr(ctx, w, r, errors.New("invalid token"), http.StatusUnauthorized)
				return
			}

			log.Debugf(ctx, "corsHandler VERIFY token")

			//app, err := firebase.InitializeApp(&firebase.Options{
			//	ServiceAccountPath: "eritis-be-97911f39ed2a.json",
			//})
			//
			//if err != nil {
			//	log.Debugf(ctx, "corsHandler InitializeApp failed %s", err)
			//	//RespondErr(ctx, w, r, err, http.StatusUnauthorized)
			//	//return
			//}

			//firebase.InitializeApp(&firebase.Options{
			//	ServiceAccountPath: "eritis-be-97911f39ed2a.json",
			//})
			//
			//log.Debugf(ctx, "corsHandler InitializeApp ok")
			//
			////verify token
			auth, _ := firebase.GetAuth()
			decodedToken, err := auth.VerifyIDToken(token)
			if err != nil {
				log.Debugf(ctx, "corsHandler VerifyIDToken failed %s", err)
				//RespondErr(ctx, w, r, err, http.StatusUnauthorized)
				return
			}

			if err == nil {
				uid, found := decodedToken.UID()
				log.Debugf(ctx, "corsHandler decodedToken uid %s, found %s", uid, found)
			}

			//uid, found := decodedToken.UID()
			//if !found {
			//	RespondErr(ctx, w, r, errors.New("UID not found"), http.StatusUnauthorized)
			//}
			//
			//log.Debugf(ctx, "corsHandler UID: %s", uid)
			//
			//SetCurrentFirebaseId(uid)

			//auth ok, continue
			handler(w, r)
		}
	}
}
