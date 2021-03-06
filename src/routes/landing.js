import React, {Component} from 'react'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Spin, Row, Col} from 'antd'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Photo from '../components/Photo'
import Button from '../components/Button'

import {app} from '../core/fire'

import {login} from '../ducks/user'
import {chooseStar} from '../ducks/campers'

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
  padding: 1.8em 1.8em;
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

const Select = styled.select`
  font-weight: 300;
  text-align: left;
  font-size: 1.18em;
  line-height: 1em;

  width: 100%;
  padding: 0.5em 0.8em;
  margin-top: 1em;

  min-width: 13em;
  outline: none;
  transition: 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) all;

  border: none;
  border-radius: 4px;

  background: white;
  color: #555;
  border-bottom: 2px solid #555;
  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);

  &::placeholder {
    color: #999;
  }

  &:hover {
    box-shadow: 0 3px 18.5px 2px rgba(0, 0, 0, 0.18);
  }

  &:focus,
  &:active {
    transform: scale(1.045);
    box-shadow: 0 3px 18.5px 2px rgba(0, 0, 0, 0.18);
  }
`

const Character = styled.img`
  width: 11em;
`

const Nick = styled.div`
  color: #333;
  font-size: 1.5em;
  text-align: center;
`

const db = app.firestore()

const getCharacter = major => require(`../assets/${major}.svg`)

const slider = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
}

const ranks = ['star', 'moon', 'popguy', 'popgirl']

const labels = {
  star: 'ดาวค่าย',
  moon: 'เดือนค่าย',
  popguy: 'หนุ่ม Popular',
  popgirl: 'สาว Popular',
}

const buttonState = (stars, uid, rank, id) => {
  const record = stars.find(x => x.id === uid)

  if (record) {
    if (record[rank] === id) {
      return 'primary'
    }
  }

  return 'dashed'
}

class Landing extends Component {
  vote = async (id, key) => {
    const record = this.props.stars.find(x => x.id === this.props.user.uid)

    if (record && record[key] === id) {
      console.log('[-] Unselecting', id)
      await this.props.chooseStar(null, key)

      return
    }

    console.log('[+] Selecting', id, '->', key)

    await this.props.chooseStar(id, key)
  }

  render() {
    const {campers, stars, user, loading, login, vote} = this.props

    if (loading) {
      return (
        <Backdrop>
          <Character src={getCharacter('design')} />
          <Paper>
            <Spin />
          </Paper>
        </Backdrop>
      )
    }

    if (!user.uid) {
      return (
        <Backdrop>
          <Character src={getCharacter('design')} />
          <Paper>
            <Heading>โหวตดาวเดือนของค่าย JWCx</Heading>
            <Button type="primary" size="large" onClick={login}>
              เข้าสู่ระบบด้วย Facebook
            </Button>
          </Paper>
        </Backdrop>
      )
    }

    return (
      <Backdrop>
        <Character src={getCharacter('design')} />
        <Paper>
          <Heading>โหวตดาวและเดือนค่าย JWCx</Heading>

          <div style={{fontSize: '1.1em'}}>
            เข้าสู่ระบบแล้วในชื่อ: <b>{user.displayName}</b>
          </div>
        </Paper>

        <Row type="flex" justify="start" gutter={32}>
          {campers.map(camper => (
            <Col xs={24} sm={12} lg={6} key={camper.id}>
              <Paper key={camper.id}>
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
                  {ranks.map(rank => (
                    <Button
                      key={rank}
                      type={buttonState(stars, user.uid, rank, camper.id)}
                      onClick={() => this.vote(camper.id, rank)}
                      style={{width: '100%', marginTop: '1em'}}>
                      {labels[rank]}
                    </Button>
                  ))}
                </div>
              </Paper>
            </Col>
          ))}
        </Row>
      </Backdrop>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.user.loading,
  campers: state.camper.campers,
  stars: state.camper.stars,
})

const enhance = connect(mapStateToProps, {login, chooseStar})

export default enhance(Landing)
