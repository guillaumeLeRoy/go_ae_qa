package api

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type Meeting struct {
	Key        *datastore.Key `json:"id" datastore:"-"`
	AgreedTime *datastore.Key `json:"agreed_date"`
	CoachKey   *datastore.Key `json:"coach_id"`
	CoacheeKey *datastore.Key `json:"coachee_id"`
	IsOpen     bool `json:"isOpen"`
}

/**
Visual representation of a meeting
 */
type ApiMeeting struct {
	Key        *datastore.Key `json:"id" datastore:"-"`
	AgreedTime *MeetingTime `json:"agreed_date"`
	Coach      *Coach `json:"coach"`
	Coachee    *APICoachee `json:"coachee"`
	IsOpen     bool `json:"isOpen"`
}

func (m *Meeting) Create(ctx context.Context) error {
	log.Debugf(ctx, "Create meeting", m)

	//TODO add an ancestor
	m.Key = datastore.NewIncompleteKey(ctx, "Meeting", nil)

	//meeting is open
	m.IsOpen = true

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func (m *Meeting) Close(ctx context.Context) error {
	log.Debugf(ctx, "Close meeting", m)

	m.IsOpen = false

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeeting(ctx context.Context, key *datastore.Key) (*Meeting, error) {
	log.Debugf(ctx, "GetAPIMeeting for key %s", key)

	var meeting Meeting
	err := datastore.Get(ctx, key, &meeting)
	if err != nil {
		return nil, err
	}
	meeting.Key = key

	return &meeting, nil
}

func (m *Meeting)GetAPIMeeting(ctx context.Context) (*ApiMeeting, error) {
	log.Debugf(ctx, "GetAPIMeeting", m)

	var ApiMeeting ApiMeeting
	ApiMeeting.Key = m.Key
	ApiMeeting.IsOpen = m.IsOpen

	//get meeting time
	time, err := GetMeetingTime(ctx, m.AgreedTime)
	if err != nil {
		return nil, err
	}
	ApiMeeting.AgreedTime = time
	//get coach
	coach, err := GetCoach(ctx, m.CoachKey)
	if err != nil {
		return nil, err
	}
	ApiMeeting.Coach = coach
	//get coachee
	coachee, err := GetCoachee(ctx, m.CoacheeKey)
	if err != nil {
		return nil, err
	}
	ApiMeeting.Coachee = coachee

	return &ApiMeeting, nil
}

func (m *Meeting) SetMeetingTime(ctx context.Context, meetingTimeKey *datastore.Key) error {
	log.Debugf(ctx, "SetMeetingTime", m)

	m.AgreedTime = meetingTimeKey

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeetingsForCoach(ctx context.Context, coachKey *datastore.Key) ([]*ApiMeeting, error) {
	log.Debugf(ctx, "GetMeetingsForCoach")

	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoachKey =", coachKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	//TODO synchronise call

	//get coach
	coach, err := GetCoach(ctx, coachKey)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoach, coach obtained")

	var ApiMeetings []*ApiMeeting = make([]*ApiMeeting, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to ApiMeeting
		var ApiMeeting ApiMeeting
		ApiMeeting.Key = meeting.Key
		ApiMeeting.IsOpen = meeting.IsOpen
		ApiMeeting.Coach = coach

		//get coachee
		coachee, err := GetCoachee(ctx, meeting.CoacheeKey)
		if err != nil {
			return nil, err
		}
		ApiMeeting.Coachee = coachee

		//get meeting agreed time
		if meeting.AgreedTime != nil {
			ApiMeeting.AgreedTime, err = GetMeetingTime(ctx, meeting.AgreedTime)
			if err != nil {
				return nil, err
			}
		}

		log.Debugf(ctx, "GetMeetingsForCoach, ApiMeeting created, %s", ApiMeeting)

		ApiMeetings[i] = &ApiMeeting
	}

	return ApiMeetings, nil
}

func GetMeetingsForCoachee(ctx context.Context, coacheeKey *datastore.Key) ([]*ApiMeeting, error) {
	log.Debugf(ctx, "GetMeetingsForCoachee")

	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoacheeKey =", coacheeKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	//TODO synchronise call

	//get coachee
	coachee, err := GetCoachee(ctx, coacheeKey)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, coachee obtained", coachee)

	var ApiMeetings []*ApiMeeting = make([]*ApiMeeting, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to ApiMeeting
		var ApiMeeting ApiMeeting
		ApiMeeting.Key = meeting.Key
		ApiMeeting.IsOpen = meeting.IsOpen
		ApiMeeting.Coachee = coachee

		//get coach
		coach, err := GetCoach(ctx, meeting.CoachKey)
		if err != nil {
			return nil, err
		}
		ApiMeeting.Coach = coach

		if meeting.AgreedTime != nil {
			//get meeting agreed time
			ApiMeeting.AgreedTime, err = GetMeetingTime(ctx, meeting.AgreedTime)
			if err != nil {
				return nil, err
			}
		}

		log.Debugf(ctx, "GetMeetingsForCoachee, ApiMeeting created, %s", ApiMeeting)

		ApiMeetings[i] = &ApiMeeting
	}

	return ApiMeetings, nil
}