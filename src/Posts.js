import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";

const Posts = () => {
  const [postData, setPostData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const getPost = async (page) => {
    setLoading(true);
    const url = `https://gorest.co.in/public/v2/posts?page=${page}&per_page=30`;
    const response = await fetch(url);
    let res = await response.json();
    if (response.ok) {
      setPostData(res);
      // 👇 get total pages from headers
      const total = response.headers.get("X-Pagination-Pages");
      setTotalPages(Number(total));
      setLoading(false);
    }
  };
  useEffect(() => {
    getPost(page);
  }, [page]);
  console.log(totalPages);
  return (
    <>
      <Container className="py-5">
        <h3>Posts</h3>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : null}
        <Row>
          {postData.map((data, key) => (
            <Col md={4} sm={6} key={key}>
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>{data.title}</Card.Title>
                  <p>{data.id}</p>
                  <Card.Text>
                    {isExpanded && rowId === data.id
                      ? data.body
                      : data.body.slice(0, 150) + "..."}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => {
                        setIsExpanded(!isExpanded);
                        setRowId(data.id);
                      }}
                    >
                      {isExpanded && rowId === data.id
                        ? " Read Less"
                        : " Read More"}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {!loading ? (
          <Pagination>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>First</Tooltip>}
            >
              <Pagination.First
                onClick={() => setPage(1)}
                disabled={page === 1}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Previous</Tooltip>}
            >
              <Pagination.Prev
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Next</Tooltip>}
            >
              <Pagination.Next
                onClick={() => setPage(page + 1)}
                disabled={postData.length < 12 || page === totalPages}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Last</Tooltip>}
            >
              <Pagination.Last
                onClick={() => setPage(totalPages)}
                disabled={postData.length < 12 || page === totalPages}
              />
            </OverlayTrigger>
          </Pagination>
        ) : null}
      </Container>
    </>
  );
};

export default Posts;
