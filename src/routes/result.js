import React from 'react'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Row, Col} from 'antd'

import Photo from '../components/Photo'
import Button from '../components/Button'

import {app} from '../core/fire'
import {login} from '../ducks/user'

const Backdrop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: linear-gradient(rgb(105, 115, 173), rgb(107, 201, 233));
  background-attachment: fixed;

  width: 100%;
  min-height: 100vh;

  padding: 0 2em;
`

const Paper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 3.2em;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 3px 18.5px 2px;

  width: 100%;
  padding: 1.8em 2.2em;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
`

const Heading = styled.h1`
  margin: 0;
  margin-bottom: 0.5em;
  text-align: center;

  font-size: 2.2em;
  font-weight: 300;
  color: #333;
`

const Character = styled.img`
  width: 11em;
`

const Nick = styled.div`
  color: #333;
  font-size: 1.5em;
  text-align: center;
`

const Stat = styled.div`
  color: #333;
  font-size: 1.5em;
  text-align: center;
`

const db = app.firestore()

const getCharacter = major => require(`../assets/${major}.svg`)

const StatCard = ({stars, camper}) => (
  <Paper>
    <Nick>
      <div>{camper.nick}</div>
      <div style={{fontSize: '0.69em'}}>
        ({camper.firstName} {camper.lastName})
      </div>
    </Nick>
    <Photo id={camper.id} />
    <div style={{fontSize: '1.1em', textAlign: 'center'}}>
      <div>บ้าน {camper.house}</div>
      <div>สาขา {camper.major}</div>
    </div>
    <div>
      <Stat>ดาว: {stars.filter(x => x.star === camper.id).length}</Stat>
      <Stat>เดือน: {stars.filter(x => x.moon === camper.id).length}</Stat>
      <Stat>ป็อปบอย: {stars.filter(x => x.popguy === camper.id).length}</Stat>
      <Stat>
        ป็อปเกริล: {stars.filter(x => x.popgirl === camper.id).length}
      </Stat>
    </div>
  </Paper>
)

const getTop = (key, data, stars) => {
  const campers = data
    .map(item => ({
      ...item,
      votes: stars.filter(x => x[key] === item.id).length,
    }))
    .sort((a, b) => b.votes - a.votes)

  const camper = campers[0]

  return <StatCard camper={camper} stars={stars} key={camper.id} />
}

const Landing = ({campers, stars, user, loading, login}) => {
  return (
    <Backdrop>
      <Character src={getCharacter('design')} />
      <Paper>
        <Heading>ผลลัพธ์การโหวตดาวเดือนค่าย JWCx</Heading>

        <div style={{fontSize: '1.1em'}}>
          เข้าสู่ระบบแล้วในชื่อ: <b>{user.displayName}</b>
        </div>
      </Paper>

      {getTop('star', campers, stars)}
      {getTop('moon', campers, stars)}
      {getTop('popguy', campers, stars)}
      {getTop('popgirl', campers, stars)}
    </Backdrop>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.user.loading,
  campers: state.camper.campers,
  stars: state.camper.stars,
})

const enhance = connect(mapStateToProps, {login})

export default enhance(Landing)
