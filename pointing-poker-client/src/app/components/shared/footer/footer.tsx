import { Col, Container, Image, Row } from 'react-bootstrap';

function Footer(): JSX.Element {
  return (
    <footer className="bg-primary">
      {/* <a className="github" href="https://github.com/Holbootla" target="blank">
        <img src="GitHubLogo.png" alt="GitHub logo" />
      </a>
      <div className="year">2021</div>
      <a className="rsschool" href="https://rs.school/js/" target="blank">
        <img src="RSSchoolLogo.png" alt="RSSchool logo" />
      </a> */}
      <Container>
        <Row>
          <Col>
            <a href="https://rs.school/react/">
              <Image
                className="rs-logo"
                src="https://rs.school/images/rs_school_js.svg"
              />
            </a>
          </Col>
          <Col className="mt-1">2021</Col>
          <Col>
            <Row className="mt-1">
              <Col className="author">
                <a
                  href="https://github.com/SK-website"
                  target="_blank"
                  rel="noreferrer"
                >
                  SK-website
                </a>
              </Col>
              <Col>
                <a
                  href="https://github.com/Comingsoon000"
                  target="_blank"
                  rel="noreferrer"
                >
                  Comingsoon000
                </a>
              </Col>
              <Col>
                <a
                  href="https://github.com/Holbootla"
                  target="_blank"
                  rel="noreferrer"
                >
                  Holbootla
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
