package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"time"
	"errors"
	"strconv"
	"strings"
	"golang.org/x/net/context"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
	"fmt"
	"eritis_be/pkg/utils"
)

type Review struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

//start and end hours are 24 based
type Potential struct {
	StartDate int64 `json:"start_date"`
	EndDate   int64 `json:"end_date"`
}

type ValidatedMeeting struct {
	CoacheeKey *datastore.Key
	Context    *Review
	Goal       *Review
	Dates      *[]*Potential
}

func HandleMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {

	case "POST":

		//create potential meeting time
		if ok := strings.Contains(r.URL.Path, "potentials"); ok {
			params := response.PathParams(ctx, r, "/v1/meetings/:uid/potentials")
			uid, ok := params[":uid"]
			if ok {
				handleReqCreateMeetingPotentialTime(w, r, uid) // POST /v1/meetings/:uid/potentials
				return
			}
		}

		// create new meeting
		if ok := strings.Contains(r.URL.Path, "meetings"); ok {
			handleRequestCreateMeeting(w, r) // POST /v1/meetings
			return
		}

		http.NotFound(w, r)
	case "PUT":

		//add coach to meeting
		contains := strings.Contains(r.URL.Path, "coachs")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/:meetingId/coachs/:coachId")
			meetingId, ok := params[":meetingId"]
			coachId, ok := params[":coachId"]
			if ok {
				handleSetCoachForMeeting(w, r, meetingId, coachId)
				return
			}
		}

		// set meeting hour
		contains = strings.Contains(r.URL.Path, "dates")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/:meetingId/dates/:potId")
			meetingId, ok := params[":meetingId"]
			potId, ok := params[":potId"]
			if ok {
				handleReqSetTimeForMeeting(w, r, meetingId, potId)
				return
			}
		}

		// close meeting with review
		contains = strings.Contains(r.URL.Path, "close")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/:uid/close")
			uid, ok := params[":uid"]
			if ok {
				closeMeeting(w, r, uid) // PUT /v1/meetings/:uid/close
				return
			}
		}

		// update meeting review
		if ok := strings.Contains(r.URL.Path, "reviews"); ok {
			params := response.PathParams(ctx, r, "/v1/meetings/:uid/reviews")
			uid, ok := params[":uid"]
			if ok {
				handleRequestUpdateReviewForMeeting(w, r, uid) // PUT /v1/meetings/:uid/reviews
				return
			}
		}

		// update meeting
		if ok := strings.Contains(r.URL.Path, "meetings"); ok {
			params := response.PathParams(ctx, r, "/v1/meetings/:meetingId")
			meetingId, ok := params[":meetingId"]
			if ok {
				handleRequestUpdateMeeting(w, r, meetingId) // PUT /v1/meetings/:meetingId
				return
			}
		}

		http.NotFound(w, r)
	case "GET":

		/**
		 GET all meetings for a specific coachee
		 */
		contains := strings.Contains(r.URL.Path, "meetings/coachees")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/coachees/:uid")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				getAllMeetingsForCoachee(w, r, uid) // GET /v1/meetings/coachees/:uid
				return
			}

		}

		/**
		 GET all meetings for a specific coach
		 */
		contains = strings.Contains(r.URL.Path, "meetings/coachs")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/coachs/:uid")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				getAllMeetingsForCoach(w, r, uid) // GET /v1/meetings/coachs/:uid
				return
			}
		}

		/**
		   GET all potential dates
		*/
		contains = strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/:meetingId/potentials")
			//get uid param
			meetingId, ok := params[":meetingId"]
			if ok {
				handleRequestGETPotentialsTimeForAMeeting(w, r, meetingId) // GET /meetings/:meetingId/potentials
				return
			}

		}

		//get all reviews for a meeting
		contains = strings.Contains(r.URL.Path, "reviews")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/:meetingId/reviews")
			//get uid param
			meetingId, ok := params[":meetingId"]
			if ok {
				getAllReviewsForAMeeting(w, r, meetingId, r.URL.Query().Get("type")) // GET /meeting/:meetingId/reviews
				return
			}
		}

		//get all Meetings with no Coach associated
		contains = strings.Contains(r.URL.Path, "/v1/meetings")
		if contains {
			getAvailableMeetings(w, r) // GET /v1/meetings
			return

		}

		http.NotFound(w, r)
		return

	case "DELETE":
		//delete potential dates for a meeting : can be call when a coachee wants to delete a potential date
		// or when a coach want to delete a potential date
		contains := strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/potentials/:potId")
			potId, ok := params[":potId"]
			if ok {
				deletePotentialDate(w, r, potId)
				return
			}
		}

		//delete review for a meeting
		contains = strings.Contains(r.URL.Path, "reviews")
		if contains {
			params := response.PathParams(ctx, r, "/v1/meetings/reviews/:reviewId")
			potId, ok := params[":reviewId"]
			if ok {
				handleDeleteMeetingReview(w, r, potId)
				return
			}
		}

		//when a coachee wants to delete meeting
		params := response.PathParams(ctx, r, "/v1/meetings/:meetingId")
		meetingId, ok := params[":meetingId"]
		if ok {
			handleCoacheeCancelMeeting(w, r, meetingId)
			return
		}

		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleRequestUpdateMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleRequestUpdateMeeting")

	validatedParams, err := validateUpdateOrCreateMeetingReqParams(ctx, r)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	// verify we have a meeting for this key
	meeting, err := model.GetMeeting(ctx, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = updateMeeting(ctx, validatedParams, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send emails & update notif

	coachee, err := model.GetCoachee(ctx, validatedParams.CoacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	// send email to coachee
	err = sendMeetingUpdatedEmailToCoachee(ctx, coachee) //TODO could be on a thread
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// send email to associated coach or all coachs
	if meeting.MeetingCoachKey == nil {
		// send emails to all our coachs
		coachs, err := model.GetAllCoach(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
		err = sendMeetingUpdatedEmailToAllCoachs(ctx, coachs) //TODO could be on a thread
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	} else {
		associatedCoach, err := model.GetCoach(ctx, meeting.MeetingCoachKey)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}

		err = sendMeetingUpdatedEmailToCoach(ctx, associatedCoach) //TODO could be on a thread
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}

		// send notification to associated Coach
		model.CreateNotification(ctx, fmt.Sprintf(model.TO_COACH_MEETING_UPDATED_BY_COACHEE, coachee.Email), associatedCoach.Key)
	}

	// send notification to associated HR
	model.CreateNotification(ctx, fmt.Sprintf(model.TO_HR_MEETING_UPDATED, coachee.Email), coachee.AssociatedRh)

	// convert to API response
	apiRes, err := meeting.ConvertToAPIMeeting(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, apiRes, http.StatusOK)

}

func handleRequestCreateMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleRequestCreateMeeting")

	validatedParams, err := validateUpdateOrCreateMeetingReqParams(ctx, r)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//verify this user can create a new meeting
	coachee, err := model.GetCoachee(ctx, validatedParams.CoacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//check
	if coachee.AvailableSessionsCount <= 0 {
		response.RespondErr(ctx, w, r, errors.New("limit reached"), http.StatusBadRequest)
		return
	}

	//create new meeting
	meeting, err := model.CreateMeetingCoachee(ctx, validatedParams.CoacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	err = updateMeeting(ctx, validatedParams, meeting.Key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//decrease number of available sessions and save
	err = coachee.DecreaseAvailableSessionsCount(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	// send email and notif
	err = sendMeetingCreatedEmailToCoachee(ctx, coachee) //TODO could be on a thread
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// send notification to associated HR
	model.CreateNotification(ctx, fmt.Sprintf(model.TO_HR_MEETING_CREATED, coachee.Email), coachee.AssociatedRh)

	// send emails to all our coachs
	coachs, err := model.GetAllCoach(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	err = sendMeetingCreatedEmailToAllCoachs(ctx, coachs)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, meeting, http.StatusCreated)
}

func getAllMeetingsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoach")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var meetings []*model.ApiMeetingCoachee
	meetings, err = model.GetMeetingsForCoach(ctx, key);
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, meetings, http.StatusCreated)
}

func getAllMeetingsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoachee")

	coacheeKey, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var meetings []*model.ApiMeetingCoachee
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "getAllMeetingsForCoachee, transaction start")

		meetings, err = model.GetMeetingsForCoachee(ctx, coacheeKey);
		if err != nil {
			return err
		}

		log.Debugf(ctx, "getAllMeetingsForCoachee, transaction DONE")

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "getAllMeetingsForCoachee, %s", meetings)

	response.Respond(ctx, w, r, &meetings, http.StatusCreated)
}

/* Add a review for this meeting. Only one review can exist for a given type.
*/
func handleRequestUpdateReviewForMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleRequestUpdateReviewForMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review Review
	err = response.Decode(r, &review)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	log.Debugf(ctx, "handleRequestUpdateReviewForMeeting, review : ", review)

	meetingReview, err := updateReviewForAMeeting(ctx, &review, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, meetingReview, http.StatusCreated)
}

/* Add a review for this meeting. Only one review can exist for a given type.
*/
func updateReviewForAMeeting(ctx context.Context, review *Review, meetingKey *datastore.Key) (*model.MeetingReview, error) {

	//convert
	reviewType, err := model.ConvertToReviewType(review.Type)
	if err != nil {
		return nil, err
	}

	//check if a review already for this type
	reviews, err := model.GetReviewsForMeetingAndForType(ctx, meetingKey, review.Type)
	if err != nil {
		return nil, err
	}

	var meetingRev *model.MeetingReview
	if len(reviews) == 0 {
		//create review
		meetingRev, err = model.CreateReview(ctx, meetingKey, review.Value, reviewType)
		if err != nil {
			return nil, err
		}
	} else {
		//update review
		//reviews[0] should be safe to access to
		meetingRev, err = reviews[0].UpdateReview(ctx, reviews[0].Key, review.Value)
		if err != nil {
			return nil, err
		}
	}

	// if review is of type SESSION_RATE then also create a CoachRate
	if reviewType == model.SESSION_RATE {
		// get meeting
		meetingCoachee, err := model.GetMeeting(ctx, meetingKey)
		if err != nil {
			return nil, err
		}
		rate, err := strconv.Atoi(review.Value)
		if err != nil {
			return nil, err
		}

		coachKey := meetingCoachee.MeetingCoachKey.Parent()
		raterKey := meetingCoachee.Key.Parent()

		// TODO maybe replace any existing rate for a couple meetingKeyKey/raterKey
		coachRate, err := model.CreateCoachRate(ctx, coachKey, raterKey, meetingCoachee.Key, rate)
		if err != nil {
			return nil, err
		}
		//update coach rate TODO : should be sync
		coach, err := model.GetCoach(ctx, coachKey)
		if err != nil {
			return nil, err
		}

		// TODO : should be sync
		coach.AddRate(ctx, coachRate)
	}

	return meetingRev, nil
}

func getAllReviewsForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string, reviewType string) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getReviewsForAMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var reviews []*model.MeetingReview
	if reviewType != "" {
		reviews, err = model.GetReviewsForMeetingAndForType(ctx, meetingKey, reviewType)
	} else {
		reviews, err = model.GetAllReviewsForMeeting(ctx, meetingKey)
	}
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, reviews, http.StatusCreated)
}

/* We suppose the meeting is closed by a Coach */
func closeMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "closeMeeting, meetingId : ", meetingId)

	key, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review struct {
		Result  string `json:"result"`
		Utility string `json:"utility"`
	}
	err = response.Decode(r, &review)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "closeMeeting, got review %s : ", review)

	var ApiMeeting *model.ApiMeetingCoachee
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		var err error
		var meeting *model.MeetingCoachee
		meeting, err = model.GetMeeting(ctx, key)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, get meeting", meeting)

		//create review for result
		meetingRev, err := model.CreateReview(ctx, meeting.Key, review.Result, model.SESSION_RESULT)
		if err != nil {
			return err
		}
		log.Debugf(ctx, "closeMeeting, review result created : ", meetingRev)

		//create review
		meetingRevUtility, err := model.CreateReview(ctx, meeting.Key, review.Utility, model.SESSION_UTILITY)
		if err != nil {
			return err
		}
		log.Debugf(ctx, "closeMeeting, review utility created : ", meetingRevUtility)

		err = meeting.Close(ctx)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, closed")

		//convert to API meeting
		ApiMeeting, err = meeting.ConvertToAPIMeeting(ctx)
		if err != nil {
			return err
		}

		coachKey := meeting.MeetingCoachKey.Parent()

		// increase coach sessions count
		coach, err := model.GetCoach(ctx, coachKey)
		if err != nil {
			return err
		}
		coach.IncreaseSessionsCount(ctx)

		// get coachee
		coacheeKey := meeting.Key.Parent()
		coachee, err := model.GetCoachee(ctx, coacheeKey)
		if err != nil {
			return err
		}
		// increase "sessions done" count
		coachee.IncreaseSessionsDoneCount(ctx)

		//TODO send email

		//add notification to coachee
		model.CreateNotification(ctx, model.TO_COACHEE_MEETING_CLOSED_BY_COACH, meeting.Key.Parent())

		//add notification to HR
		associatedHRKey, err := datastore.DecodeKey(ApiMeeting.Coachee.AssociatedRh.Id)
		if err != nil {
			return err
		}
		model.CreateNotification(ctx, fmt.Sprintf(model.TO_HR_MEETING_CLOSED, ApiMeeting.Coachee.GetDisplayName()), associatedHRKey)

		//add notification to coach
		model.CreateNotification(ctx, fmt.Sprintf(model.TO_COACH_MEETING_CLOSED, ApiMeeting.Coachee.GetDisplayName()), coachKey)

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, ApiMeeting, http.StatusOK)
}

//func handleReqAddMeetingPotentialTimes(w http.ResponseWriter, r *http.Request, meetingId string) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleReqAddMeetingPotentialTimes, meeting id %s", meetingId)
//
//	meetingKey, err := datastore.DecodeKey(meetingId)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//	//start and end hours are 24 based
//	var Potentials struct {
//		Dates []Potential `json:"dates"`
//	}
//	err = response.Decode(r, &Potentials)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	log.Debugf(ctx, "handleReqAddMeetingPotentialTimes, Potentials %s", Potentials)
//
//	// remove all existing potentialTime
//	err = model.ClearAllMeetingTimesForAMeeting(ctx, meetingKey)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	// add new ones
//	var potentialTimes []*model.MeetingTime = make([]*model.MeetingTime, len(Potentials.Dates))
//	for _, pot := range Potentials.Dates {
//		potentialTime, err := createMeetingPotentialTime(ctx, &pot, meetingKey)
//		if err != nil {
//			response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//			return
//		}
//		potentialTimes = append(potentialTimes, potentialTime)
//	}
//
//	response.Respond(ctx, w, r, &potentialTimes, http.StatusOK)
//
//}

func handleReqCreateMeetingPotentialTime(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createMeetingPotentialTime, meeting id %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var potential Potential
	err = response.Decode(r, &potential)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	potentialTime, err := createMeetingPotentialTime(ctx, &potential, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	apiMeetingTime := potentialTime.ConvertToAPI()

	response.Respond(ctx, w, r, apiMeetingTime, http.StatusOK)
}

// create a potential time for the given meeting
func createMeetingPotentialTime(ctx context.Context, potential *Potential, meetingKey *datastore.Key) (*model.MeetingTime, error) {
	startDate := time.Unix(potential.StartDate, 0)
	log.Debugf(ctx, "handleCreateMeeting, startDate : ", startDate)

	endDate := time.Unix(potential.EndDate, 0)
	log.Debugf(ctx, "handleCreateMeeting, endDate : ", endDate)

	meetingTime := model.Constructor(startDate, endDate)
	err := meetingTime.Create(ctx, meetingKey)
	if err != nil {
		return nil, err
	}
	return meetingTime, err
}

//get all potential times for the given meeting
func handleRequestGETPotentialsTimeForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleRequestGETPotentialsTimeForAMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetings, err := model.GetMeetingPotentialTimes(ctx, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	response.Respond(ctx, w, r, meetings, http.StatusOK)
}

// set this potentialMeetingTime as this meeting MeetingTime
func handleReqSetTimeForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleReqSetTimeForMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetingTimeKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//set potential time to meeting
	meeting, err := model.GetMeeting(ctx, meetingKey)
	meeting.SetMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	coacheeKey := meeting.Key.Parent()
	coachee, err := model.GetCoachee(ctx, coacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// a coach should be associated, todo maybe check is MeetingCoachKey not nil
	coachKey := meeting.MeetingCoachKey.Parent()
	coach, err := model.GetCoach(ctx, coachKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	meetingTime, err := model.GetMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// send email to coachee
	err = sendMeetingDateSetEmailToCoachee(ctx, coachee, coach, meetingTime)
	//add notification to coachee
	model.CreateNotification(ctx, model.TO_COACHEE_MEETING_TIME_SELECTED_FOR_SESSION, coacheeKey)

	// send email to coach
	err = sendMeetingDateSetEmailToCoach(ctx, coachee, coach, meetingTime)
	//add notification to coach
	model.CreateNotification(ctx, model.TO_COACH_MEETING_TIME_SELECTED_FOR_SESSION, coachKey)

	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// TODO add notification to HR
	// model.CreateNotification(ctx, model.MEETING_TIME_SELECTED_FOR_SESSION, meeting.Key.Parent())

	//get API meeting
	meetingApi, err := meeting.ConvertToAPIMeeting(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, meetingApi, http.StatusOK)

}

func handleSetCoachForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, coachId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "setCoachForMeeting, meetingId %s, coach id : %s", meetingId, coachId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachKey, err := datastore.DecodeKey(coachId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	// get meetingCoachee
	meetingCoachee, err := model.GetMeeting(ctx, meetingKey)
	//associate a MeetingCoach with meetingCoachee
	model.Associate(ctx, coachKey, meetingCoachee)

	//get API meeting
	meetingApi, err := meetingCoachee.ConvertToAPIMeeting(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//send email to coachee
	baseUrl, err := utils.GetSiteUrl(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	err = utils.SendEmailToGivenEmail(ctx, meetingApi.Coachee.Email,
		COACH_SELECTED_FOR_SESSION_TITLE, fmt.Sprintf(COACH_SELECTED_FOR_SESSION_MSG, meetingApi.Coach.GetDisplayName(), baseUrl, baseUrl))

	//send notification
	content := fmt.Sprintf(model.TO_COACHEE_COACH_SELECTED_FOR_SESSION, meetingApi.Coach.GetDisplayName())
	model.CreateNotification(ctx, content, meetingCoachee.Key.Parent())

	// send response
	response.Respond(ctx, w, r, meetingApi, http.StatusOK)
}

func deletePotentialDate(w http.ResponseWriter, r *http.Request, meetingTimeId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deletePotentialDate, meetinTimeId %s", meetingTimeId)

	meetingTimeKey, err := datastore.DecodeKey(meetingTimeId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//find associated meeting
	meetingKey := meetingTimeKey.Parent()

	//remove potential from meeting
	if meetingKey != nil {
		log.Debugf(ctx, "deletePotentialDate, potential has a parent")

		meeting, err := model.GetMeeting(ctx, meetingKey)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
			return
		}

		// if this meetingTime was the AgreedTime, the we must clean the agreedTime
		if meeting.AgreedTime.String() == meetingTimeKey.String() {
			log.Debugf(ctx, "deletePotentialDate, remove agreed time")
			meeting.AgreedTime = nil
			err = meeting.Update(ctx)
			if err != nil {
				response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
				return
			}
		}
	}

	//delete potential
	model.DeleteMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//TODO send email

	//send notification
	model.CreateNotification(ctx, model.TO_COACH_MEETING_TIME_REMOVED, meetingKey.Parent())

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func handleDeleteMeetingReview(w http.ResponseWriter, r *http.Request, reviewId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deleteMeetingReview, reviewId %s", reviewId)

	potentialDateKey, err := datastore.DecodeKey(reviewId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	model.DeleteMeetingReview(ctx, potentialDateKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func handleCoacheeCancelMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCoacheeCancelMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//remove all meetingTimes for this meeting
	err = model.ClearAllMeetingTimesForAMeeting(ctx, meetingKey)
	if err != nil {
		return
	}

	//remove reviews
	err = model.DeleteAllReviewsForMeeting(ctx, meetingKey)
	if err != nil {
		return
	}

	//delete meeting in a transaction to be immediately reflected
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "handleCoacheeCancelMeeting, RunInTransaction")

		//load meetingCoachee
		meetingCoachee, err := model.GetMeeting(ctx, meetingKey)
		if err != nil {
			return err
		}

		//remove meetingCoachee
		meetingCoachee.Delete(ctx)
		if err != nil {
			return err
		}

		//load meetingCoach if any
		if meetingCoachee.MeetingCoachKey != nil {
			meetingCoach, err := model.GetMeetingCoach(ctx, meetingCoachee.MeetingCoachKey)
			if err != nil {
				return err
			}

			// remove meeting coach
			err = meetingCoach.Delete(ctx)
			if err != nil {
				return err
			}

			//TODO send email to inform coach the meeting was removed

			//add notification to coach
			model.CreateNotification(ctx, model.TO_COACH_MEETING_CANCELED_BY_COACHEE, meetingCoachee.MeetingCoachKey.Parent())
		}

		log.Debugf(ctx, "handleCoacheeCancelMeeting, RunInTransaction DONE")

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//get coachee for this meeting
	coachee, err := model.GetCoachee(ctx, meetingKey.Parent())
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//increase available sessions count
	coachee.IncreaseAvailableSessionsCount(ctx)

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func getAvailableMeetings(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAvailableMeetings")

	meetings, err := model.GetAvailableMeetings(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert to API object
	var apiMeetings []*model.ApiMeetingCoachee = make([]*model.ApiMeetingCoachee, len(meetings))
	for i, meeting := range meetings {
		apiMeetings[i], err = meeting.ConvertToAPIMeeting(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	//return
	response.Respond(ctx, w, r, &apiMeetings, http.StatusOK)
}

func validateUpdateOrCreateMeetingReqParams(ctx context.Context, r *http.Request) (*ValidatedMeeting, error) {

	var newMeeting struct {
		CoacheeId string        `json:"coacheeId"`
		Context   *Review       `json:"context"`
		Goal      *Review       `json:"goal"`
		Dates     *[]*Potential `json:"dates"`
	}
	err := response.Decode(r, &newMeeting)
	if err != nil {
		//response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return nil, err
	}

	log.Debugf(ctx, "handleCreateMeeting, coacheeId ", newMeeting.CoacheeId)

	coacheeKey, err := datastore.DecodeKey(newMeeting.CoacheeId)
	if err != nil {
		//response.RespondErr(ctx, w, r, errors.New("invalid coachee id"), http.StatusBadRequest)
		return nil, errors.New("invalid coachee id")
	}

	// verify we received a Context
	if newMeeting.Context == nil {
		//response.RespondErr(ctx, w, r, errors.New("Context is required"), http.StatusBadRequest)
		return nil, errors.New("Context is required")
	}

	// verify we received a Objectif
	if newMeeting.Goal == nil {
		//response.RespondErr(ctx, w, r, errors.New("Goal is required"), http.StatusBadRequest)
		return nil, errors.New("Goal is required")
	}

	// verify we received 3 potential dates
	if newMeeting.Dates == nil || len(*newMeeting.Dates) < 3 {
		//response.RespondErr(ctx, w, r, errors.New("At least 3 dates are required"), http.StatusBadRequest)
		return nil, errors.New("At least 3 dates are required")
	}

	var validatedMeetingParam = new(ValidatedMeeting)
	validatedMeetingParam.CoacheeKey = coacheeKey
	validatedMeetingParam.Context = newMeeting.Context
	validatedMeetingParam.Goal = newMeeting.Goal
	validatedMeetingParam.Dates = newMeeting.Dates

	return validatedMeetingParam, nil

}

func updateMeeting(ctx context.Context, validatedParams *ValidatedMeeting, meetingKey *datastore.Key) (error) {
	// add Context
	_, err := updateReviewForAMeeting(ctx, validatedParams.Context, meetingKey)
	if err != nil {
		//response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return err
	}

	// add Goal
	_, err = updateReviewForAMeeting(ctx, validatedParams.Goal, meetingKey)
	if err != nil {
		//response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return err
	}

	// remove all existing potentialTime
	err = model.ClearAllMeetingTimesForAMeeting(ctx, meetingKey)
	if err != nil {
		//response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return err
	}

	// add potential meeting dates
	var potentialTimes []*model.MeetingTime = make([]*model.MeetingTime, len(*validatedParams.Dates))
	for _, pot := range *validatedParams.Dates {
		potentialTime, err := createMeetingPotentialTime(ctx, pot, meetingKey)
		if err != nil {
			//response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
			return err
		}
		potentialTimes = append(potentialTimes, potentialTime)
	}

	return nil
}
