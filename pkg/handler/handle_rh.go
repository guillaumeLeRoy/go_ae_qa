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

		/**
		 * Add a new objective for this coachee
		 */
		if ok := strings.Contains(r.URL.Path, "objective"); ok {
			// update coachee's objective set by an HR
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uidRH/coachees/:uidCoachee/objective")
			//get uid param
			uidRH, ok := params[":uidRH"]
			uidCoachee, ok := params[":uidCoachee"]
			if ok {
				handleAddObjectiveToCoachee(w, r, uidRH, uidCoachee) // PUT /api/v1/rhs/:uidRH/coachees/:uidCoachee/objective
				return
			}
		}

		/**
		 * Create a new Rh account
		 */
		if ok := strings.Contains(r.URL.Path, "rh"); ok {
			handleCreateRh(w, r)
			return
		}

		http.NotFound(w, r)

	case "PUT":

		//update "read" status for all Notifications
		contains := strings.Contains(r.URL.Path, "notifications/read")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/notifications/read")
			uid, ok := params[":uid"]
			if ok {
				updateAllNotificationToRead(w, r, uid)
				return
			}
		}

		http.NotFound(w, r)

	case "GET":

		/**
		 GET all notification for a specific rh
		 */
		contains := strings.Contains(r.URL.Path, "notifications")
		if contains {
			log.Debugf(ctx, "handle rhs, notifications")

			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/notifications")
			//verify url contains coach
			if _, ok := params[":uid"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllNotificationsForRhs(w, r, uid) // GET /api/v1/rhs/:uid/notifications
					return
				}
			}
		}

		/**
		 GET all coachee for a specific RH
		 */
		contains = strings.Contains(r.URL.Path, "coachees")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/coachees")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllCoacheesForRH(w, r, uid) // GET /api/v1/rhs/:uid/coachees
				return
			}
		}

		/**
		 GET all potential coachees for a specific RH
		 */
		contains = strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/potentials")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllPotentialsForRH(w, r, uid) // GET /api/v1/rhs/:uid/potentials
				return
			}
		}

		/**
		 GET usage for a RH
		 */
		contains = strings.Contains(r.URL.Path, "usage")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/usage")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetRHusageRate(w, r, uid) // GET /api/v1/rhs/:uid/usage
				return
			}
		}

		/**
		* Get HR for uid
		 */
		params := response.PathParams(ctx, r, "/api/v1/rhs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetHrForId(w, r, userId) // GET /api/v1/rhs/ID
			return
		}

		http.NotFound(w, r)
	}
}

func handleGetHrForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetHrForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	hr, err := model.GetRh(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, hr, http.StatusOK)
}

func handleGetAllRHs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllRHs")

	rhs, err := model.GetAllRhs(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	var rhsAPI []*model.RhAPI = make([]*model.RhAPI, len(rhs))
	for i, rh := range rhs {
		rhsAPI[i] = rh.ToRhAPI()
	}

	response.Respond(ctx, w, r, &rhsAPI, http.StatusOK)

}

func handleGetAllCoacheesForRH(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoacheesForRH, rhId %s", rhId)

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

	log.Debugf(ctx, "handleGetAllCoacheesForRH, convert to API objects")

	//convert to API objects
	var apiCoachees []*model.CoacheeAPI = make([]*model.CoacheeAPI, len(coachees))
	for i, coachee := range coachees {
		apiCoachees[i], err = coachee.GetAPICoachee(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	response.Respond(ctx, w, r, &apiCoachees, http.StatusCreated)

}

func handleGetAllPotentialsForRH(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllPotentialsForRH, %s", rhId)

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleGetAllPotentialsForRH, rhKey %s", rhKey)

	potCoachees, err := model.GetPotentialCoacheesForRh(ctx, rhKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert to API objects
	var apiPotCoachees []*model.PotentialCoacheeAPI = make([]*model.PotentialCoacheeAPI, len(potCoachees))
	for i, potCoachee := range potCoachees {
		//get plan
		plan := model.CreatePlanFromId(potCoachee.PlanId)
		//convert to api
		apiPotCoachees[i] = potCoachee.ToPotentialCoacheeAPI(plan)
	}

	response.Respond(ctx, w, r, &apiPotCoachees, http.StatusCreated)

}

func handleGetRHusageRate(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreatePotentialCoachee, rhID %s", rhId)

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

	var totalSessionsCount = 0
	var totalSessionsDone = 0
	for _, coachee := range coachees {
		//get the plan
		plan := model.CreatePlanFromId(coachee.PlanId)
		totalSessionsCount += plan.SessionsCount
		totalSessionsDone += plan.SessionsCount - coachee.AvailableSessionsCount
	}

	var rate = 0;
	if totalSessionsDone > 0 {
		rate = totalSessionsCount / totalSessionsDone
	}

	log.Debugf(ctx, "handleGetRHusageRate, rate %s", rate)

	var res struct {
		UsageRate int `json:"usage_rate"`
	}
	res.UsageRate = rate

	response.Respond(ctx, w, r, &res, http.StatusOK)
}

func handleCreateRh(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateRh")

	var body struct {
		model.FirebaseUser
	}

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get potential Rh : email must mach
	potential, err := model.GetPotentialRhForEmail(ctx, body.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	rh, err := model.CreateRH(ctx, &body.FirebaseUser)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//remove potential
	model.DeletePotentialRh(ctx, potential.Key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send welcome email
	sendWelcomeEmailToRh(ctx, rh) //TODO could be on a thread

	//convert into API object
	api := rh.ToRhAPI()

	//construct response
	var res = &model.Login{Rh: api}
	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func handleAddObjectiveToCoachee(w http.ResponseWriter, r *http.Request, uidRH string, uidCoachee string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleAddObjectiveToCoachee")

	var body struct {
		Objective string `json:"objective"`
	}

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleAddObjectiveToCoachee, body %s", body)

	rhKey, err := datastore.DecodeKey(uidRH)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coacheeKey, err := datastore.DecodeKey(uidCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	objective, err := model.CreateCoacheeObjective(ctx, coacheeKey, rhKey, body.Objective)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, objective, http.StatusCreated)

}
