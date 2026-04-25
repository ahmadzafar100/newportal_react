import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const Posts = () => {
  const [postData, setPostData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const getPost = async () => {
    const url = "https://gorest.co.in/public/v2/posts?per_page=100";
    const response = await fetch(url);
    let res = await response.json();
    if (response.ok) {
      setPostData(res);
    }
  };
  useEffect(() => {
    getPost();
  }, []);
  return (
    <>
      <Container className="py-5">
        <h3>Posts</h3>
        <Row>
          {postData.map((data, key) => (
            <Col md={4} sm={6}>
              <div className="border p-3 mb-3">
                <p>{data.id}</p>
                <p>{data.user_id}</p>
                <p>{data.title}</p>
                <p>
                  {isExpanded ? data.body : data.body.slice(0, 150) + "..."}
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? " Read Less" : " Read More"}
                  </span>
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Posts;
