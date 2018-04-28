import React from 'react'
import {message, Modal} from 'antd'
import {takeEvery, call, fork, select, all} from 'redux-saga/effects'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'
import {majorRoles} from '../core/roles'

export const CHOOSE_STAR = 'CHOOSE_STAR'

export const SYNC_CAMPERS = 'SYNC_CAMPERS'
export const STORE_CAMPERS = 'STORE_CAMPER'

export const SYNC_STARS = 'SYNC_STARS'
export const STORE_STARS = 'STORE_STARS'

export const chooseStar = Creator(CHOOSE_STAR, 'id', 'type')

export const syncCampers = Creator(SYNC_CAMPERS)
export const storeCampers = Creator(STORE_CAMPERS)

export const syncStars = Creator(SYNC_STARS)
export const storeStars = Creator(STORE_STARS)

const db = app.firestore()

export function* syncCampersSaga() {
  const campers = db.collection('karma')

  yield fork(rsf.firestore.syncCollection, campers, {
    successActionCreator: storeCampers,
  })
}

export function* syncStarsSaga() {
  const stars = db.collection('star')

  yield fork(rsf.firestore.syncCollection, stars, {
    successActionCreator: storeStars,
  })
}

// Type is one of "star, moon, popgirl, popguy"
export function* chooseStarSaga({payload: {id, type}}) {
  const hide = message.loading('กรุณารอสักครู่...', 0)
  const userId = yield select(s => s.user.uid)

  const payload = {
    [type]: id,
  }

  const doc = db.collection('star').doc(userId)
  yield call(rsf.firestore.setDocument, doc, payload, {merge: true})

  yield call(hide)
  yield call(message.success, 'แก้ไขการโหวตเรียบร้อยแล้ว')
}

export function* camperWatcherSaga() {
  yield takeEvery(CHOOSE_STAR, chooseStarSaga)
  yield takeEvery(SYNC_CAMPERS, syncCampersSaga)
  yield takeEvery(SYNC_STARS, syncStarsSaga)
}

const initial = {
  stars: [],
  campers: [],
}

const retrieveData = doc => ({id: doc.id, ...doc.data()})

export default createReducer(initial, state => ({
  [STORE_CAMPERS]: ({docs}) => {
    const campers = docs.map(retrieveData)
    console.info('Retrieved', campers.length, 'Campers')

    return {...state, campers}
  },
  [STORE_STARS]: ({docs}) => {
    const stars = docs.map(retrieveData)
    console.info('Retrieved', stars.length, 'Stars')

    return {...state, stars}
  },
}))
