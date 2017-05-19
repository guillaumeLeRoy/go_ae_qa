package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"strings"
	"eritis_be/pkg/response"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
)

func HandlerRH(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {
	case "POST":
		params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/coachees")
		//get uid param
		uid, ok := params[":uid"]
		if ok {
			handleCreatePotentialCoachee(w, r, uid)
			return
		}
		http.NotFound(w, r)
	case "GET":
		/**
		 GET all coachee for a specific RH
		 */
		contains := strings.Contains(r.URL.Path, "coachees")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/coachees")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllCoacheesForRH(w, r, uid)// GET /api/v1/rhs/:uid
				return
			}
		}

		http.NotFound(w, r)

	}
}

func handleGetAllCoacheesForRH(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoacheesForRH")

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachees, err := model.GetCoacheesForRh(ctx, rhKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, &coachees, http.StatusCreated)

}

func handleCreatePotentialCoachee(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreatePotentialCoachee")

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var ctxPotentialCoachee struct {
		Email  string `json:"email"`
		PlanId model.PlanInt `json:"plan_id"`
	}
	err = response.Decode(r, &ctxPotentialCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//create potential
	pot, err := model.CreatePotentialCoachee(ctx, rhKey, ctxPotentialCoachee.Email, ctxPotentialCoachee.PlanId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send email
	err = SendEmailToNewCoachee(ctx, pot.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, &pot, http.StatusCreated)

}

