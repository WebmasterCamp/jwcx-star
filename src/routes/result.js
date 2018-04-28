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
  font-size: 2em;
  text-align: center;
`

const db = app.firestore()

const getCharacter = major => require(`../assets/${major}.svg`)

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

      <Row type="flex" justify="start" gutter={32}>
        {campers.map(camper => (
          <Col xs={24} sm={12} lg={6} key={camper.id}>
            <Paper key={camper.id}>
              <Nick>
                {camper.nick} ({camper.firstName} {camper.lastName})
              </Nick>
              <Photo id={camper.id} />
              <div>
                <Stat>
                  ดาว: {stars.filter(x => x.star === camper.id).length}
                </Stat>
                <Stat>
                  เดือน: {stars.filter(x => x.moon === camper.id).length}
                </Stat>
              </div>
              <small>
                {camper.house} - {camper.major}
              </small>
            </Paper>
          </Col>
        ))}
      </Row>
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
