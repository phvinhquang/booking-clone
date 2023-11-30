import classes from "./NewRoomForm.module.css";
import Card from "../../UI/Card";
import { useState, useCallback, useEffect, useRef } from "react";
import useInput from "../../hooks/use-input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenLoader } from "../../utils/auth";

const NewRoomForm = function () {
  const [hotels, setHotels] = useState([]);
  const [roomDetail, setRoomDetail] = useState(null);
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoaing] = useState(false);
  const [httpError, setHtppError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";
  const roomId = searchParams.get("id");
  const token = tokenLoader();

  //useRef
  const titleRef = useRef();
  const priceRef = useRef();
  const descRef = useRef();
  const maxPeopleRef = useRef();
  const roomNumbersRef = useRef();

  //Hàm check input rỗng
  const isEmpty = function (value) {
    return value.trim() !== "";
  };

  //Sử dụng custom hook useInput cho các input
  const {
    value: titleInputValue,
    isValid: titleInputIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleInputChangeHandler,
    inputBlurHandler: titleInputBlurHandler,
    reset: titleInputReset,
  } = useInput(isEmpty);

  const {
    value: priceInputValue,
    isValid: priceInputIsValid,
    hasError: priceInputHasError,
    valueChangeHandler: priceInputChangeHandler,
    inputBlurHandler: priceInputBlurHandler,
    reset: priceInputReset,
  } = useInput(isEmpty);

  const {
    value: descInputValue,
    isValid: descInputIsValid,
    hasError: descInputHasError,
    valueChangeHandler: descInputChangeHandler,
    inputBlurHandler: descInputBlurHandler,
    reset: descInputReset,
  } = useInput(isEmpty);

  const {
    value: maxPeopleInputValue,
    isValid: maxPeopleInputIsValid,
    hasError: maxPeopleInputHasError,
    valueChangeHandler: maxPeopleInputChangeHandler,
    inputBlurHandler: maxPeopleInputBlurHandler,
    reset: maxPeopleInputReset,
  } = useInput(isEmpty);

  const {
    value: roomNumsInputValue,
    isValid: roomNumsInputIsValid,
    hasError: roomNumsInputHasError,
    valueChangeHandler: roomNumsInputChangeHandler,
    inputBlurHandler: roomNumsInputBlurHandler,
    reset: roomNumsInputReset,
  } = useInput(isEmpty);

  // Check valid form và submit
  let formIsValid = false;
  if (
    !isEdit &&
    titleInputIsValid &&
    priceInputIsValid &&
    descInputIsValid &&
    maxPeopleInputIsValid &&
    roomNumsInputIsValid
  ) {
    formIsValid = true;
  }

  //Nhớ sửa token sau khi tạo auth
  // Hàm gửi request tạo hotel mới
  const addNewRoom = async function (reqquestData) {
    setIsLoaing(true);
    //Set url theo trạng thái edit hoặc tạo mới
    let url = `http://localhost:5000/admin/new-room?token=${token}`;
    if (isEdit) {
      url = `http://localhost:5000/admin/edit-room/${roomId}?token=${token}`;
    }

    try {
      //Chỉnh sửa lại token sau khi tạo cơ chế auth
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqquestData),
      });

      const data = await req.json();
      if (req.status === 401) {
        setHtppError(data);
      }
      if (req.status === 500) {
        setHtppError(data);
      }
      // Nếu request thành công thì chuyển về trang rooms
      if (req.status === 201) {
        navigate("/rooms");
      }
    } catch (err) {
      setHtppError(err.message);
    }
    setIsLoaing(false);
  };

  // Xử lý sự kiện nhấn submit
  const addNewRoomHandler = function () {
    setFormError(false);

    if (
      isEdit &&
      titleRef.current.value !== "" &&
      priceRef.current.value !== "" &&
      descRef.current.value !== "" &&
      maxPeopleRef.current.value !== "" &&
      roomNumbersRef.current.value !== ""
    ) {
      formIsValid = true;
    }

    // Nếu form invalid thì báo lỗi
    if (!formIsValid) {
      setFormError(true);
      return;
    }

    // Đưa data của photos và rooms vào array
    const roomNumsSplitData = [...roomNumsInputValue.split(",")];
    const roomNumsTrimmedData = roomNumsSplitData.map((num) => num.trim());

    const roomNumsRef = roomNumbersRef.current.value.split(",");
    const roomNumsRefTrimmed = roomNumsRef.map((num) => num.trim());

    //Tổng hợp data để gửi request
    const requestData = {
      title: isEdit ? titleRef.current.value : titleInputValue,
      price: isEdit ? priceRef.current.value : priceInputValue,
      desc: isEdit ? descRef.current.value : descInputValue,
      maxPeople: isEdit ? maxPeopleRef.current.value : maxPeopleInputValue,
      roomNumbers: isEdit ? roomNumsRefTrimmed : roomNumsTrimmedData,
    };

    addNewRoom(requestData);
  };

  // Hàm fetch all hotel để đưa vào input option
  const fetchHotels = useCallback(async function () {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/hotels?token=${token}`
      );

      const data = await res.json();
      setHotels(data);
    } catch (err) {}
  }, []);

  // Thực hiện fetch hotel để đưa vào input option
  useEffect(() => {
    fetchHotels();
  }, []);

  //Hàm fetch room detail để edit
  const fetchRoomDetail = useCallback(async function () {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/rooms/${roomId}?token=${token}`
      );

      const data = await res.json();
      setRoomDetail(data);
    } catch (err) {}
  }, []);

  //Nếu mode = edit thì fetch data của room đó đưa vào input
  useEffect(() => {
    if (isEdit) {
      fetchRoomDetail();
    }
  }, []);

  return (
    <>
      <Card>
        <h1 className={classes.title}>
          {isEdit ? "Edit Room" : "Add New Room"}
        </h1>
      </Card>

      <Card className={classes["form-card"]}>
        <div className={classes["form-container"]}>
          <form>
            <div className={classes["form-flexbox"]}>
              <div className={classes["form-flexbox-left"]}>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="title">Title</label>
                  </p>
                  <input
                    className={`${titleInputHasError && classes.error}`}
                    type="text"
                    id="title"
                    placeholder="2 Bed Room"
                    ref={titleRef}
                    defaultValue={
                      isEdit && roomDetail ? roomDetail.title : titleInputValue
                    }
                    // value={
                    //   isEdit && roomDetail ? roomDetail.title : titleInputValue
                    // }
                    onChange={titleInputChangeHandler}
                    onBlur={titleInputBlurHandler}
                  />
                  {titleInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="price">Price</label>
                  </p>
                  <input
                    className={`${priceInputHasError && classes.error}`}
                    type="text"
                    id="price"
                    placeholder="100"
                    ref={priceRef}
                    defaultValue={
                      isEdit && roomDetail ? roomDetail.price : priceInputValue
                    }
                    // value={
                    //   isEdit && roomDetail ? roomDetail.price : priceInputValue
                    // }
                    onChange={priceInputChangeHandler}
                    onBlur={priceInputBlurHandler}
                  />
                  {priceInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
              </div>

              <div className={classes["form-flexbox-right"]}>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="desc">Description</label>
                  </p>
                  <input
                    className={`${descInputHasError && classes.error}`}
                    type="text"
                    id="desc"
                    placeholder="King size bed, 1 bed room"
                    ref={descRef}
                    defaultValue={
                      isEdit && roomDetail ? roomDetail.desc : descInputValue
                    }
                    // value={
                    //   isEdit && roomDetail ? roomDetail.desc : descInputValue
                    // }
                    onChange={descInputChangeHandler}
                    onBlur={descInputBlurHandler}
                  />
                  {descInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="max">Max People</label>
                  </p>
                  <input
                    className={`${maxPeopleInputHasError && classes.error}`}
                    type="text"
                    id="max"
                    placeholder="2"
                    ref={maxPeopleRef}
                    defaultValue={
                      isEdit && roomDetail
                        ? roomDetail.maxPeople
                        : maxPeopleInputValue
                    }
                    // value={
                    //   isEdit && roomDetail
                    //     ? roomDetail.maxPeople
                    //     : maxPeopleInputValue
                    // }
                    onChange={maxPeopleInputChangeHandler}
                    onBlur={maxPeopleInputBlurHandler}
                  />
                  {maxPeopleInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
              </div>
            </div>

            <div className={classes["form-flexbox"]}>
              <div className={classes["form-item"]}>
                <p className={classes.label}>
                  <label htmlFor="images">Rooms</label>
                </p>
                <textarea
                  className={`${
                    roomNumsInputHasError && classes["error-textarea"]
                  }`}
                  id="images"
                  placeholder="Nếu có nhiều phòng hãy sử dụng dấu phẩy giữa các phòng"
                  ref={roomNumbersRef}
                  defaultValue={
                    isEdit && roomDetail
                      ? roomDetail.roomNumbers
                      : roomNumsInputValue
                  }
                  // value={
                  //   isEdit && roomDetail
                  //     ? roomDetail.roomNumbers
                  //     : roomNumsInputValue
                  // }
                  onChange={roomNumsInputChangeHandler}
                  onBlur={roomNumsInputBlurHandler}
                ></textarea>
              </div>
              <div className={classes["form-item"]}>
                <p className={classes.label}>
                  <label>Choose a Hotel</label>
                </p>
                <select
                // value={featuredOption === "no" ? "no" : featuredOption}
                >
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes["btn-submit"]}>
                <button type="button" onClick={addNewRoomHandler}>
                  {isLoading ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
            {formError && (
              <p className={classes["error-submit"]}>
                Form chưa có đầy đủ thông tin. Hãy điền đầy đủ thông tin vào
                những trường màu đỏ trước khi submit.
              </p>
            )}
            {httpError && (
              <p className={classes["error-submit"]}>{httpError}</p>
            )}
          </form>
        </div>
      </Card>
    </>
  );
};

export default NewRoomForm;
