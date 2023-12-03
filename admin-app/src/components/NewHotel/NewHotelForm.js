import classes from "./NewHotelForm.module.css";
import Card from "../../UI/Card";
import useInput from "../../hooks/use-input";
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenLoader } from "../../utils/auth";

const NewHotelForm = function () {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hotelId = searchParams.get("id");
  const isEdit = searchParams.get("mode") === "edit";
  const token = tokenLoader();

  const [formError, setFormError] = useState(false);
  const [featuredOption, setFeaturedOption] = useState("no");
  const [isLoading, setIsLoaing] = useState(false);
  const [httpError, setHtppError] = useState(null);
  const [hotelDetail, setHotelDetail] = useState(null);

  // useRef
  const nameRef = useRef();
  const cityRef = useRef();
  const distanceRef = useRef();
  const descRef = useRef();
  const imagesRef = useRef();
  const typeRef = useRef();
  const addressRef = useRef();
  const titleRef = useRef();
  const priceRef = useRef();
  const roomsRef = useRef();

  //Hàm check input rỗng
  const isEmpty = function (value) {
    return value.trim() !== "";
  };

  //Sử dụng custom hook useInput cho các input
  const {
    value: nameInputValue,
    isValid: nameInputIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameInputChangeHandler,
    inputBlurHandler: nameInputBlurHandler,
    reset: nameInputReset,
  } = useInput(isEmpty);

  const {
    value: cityInputValue,
    isValid: cityInputIsValid,
    hasError: cityInputHasError,
    valueChangeHandler: cityInputChangeHandler,
    inputBlurHandler: cityInputBlurHandler,
    reset: cityInputReset,
  } = useInput(isEmpty);

  const {
    value: distanceInputValue,
    isValid: distanceInputIsValid,
    hasError: distanceInputHasError,
    valueChangeHandler: distanceInputChangeHandler,
    inputBlurHandler: distanceInputBlurHandler,
    reset: distanceInputReset,
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
    value: typeInputValue,
    isValid: typeInputIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeInputChangeHandler,
    inputBlurHandler: typeInputBlurHandler,
    reset: typeInputReset,
  } = useInput(isEmpty);

  const {
    value: addressInputValue,
    isValid: addressInputIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressInputChangeHandler,
    inputBlurHandler: addressInputBlurHandler,
    reset: addressInputReset,
  } = useInput(isEmpty);

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
    value: imagesInputValue,
    isValid: imagesInputIsValid,
    hasError: imagesInputHasError,
    valueChangeHandler: imagesInputChangeHandler,
    inputBlurHandler: imagesInputBlurHandler,
    reset: imagesInputReset,
  } = useInput(isEmpty);

  const {
    value: roomsInputValue,
    isValid: roomsInputIsValid,
    hasError: roomsInputHasError,
    valueChangeHandler: roomsInputChangeHandler,
    inputBlurHandler: roomsInputBlurHandler,
    reset: roomsInputReset,
  } = useInput(isEmpty);

  const featuredOptionHandler = function (e) {
    setFeaturedOption(e.target.value);
  };

  // Check valid form và submit
  let formIsValid = false;
  if (
    !isEdit &&
    nameInputIsValid &&
    cityInputIsValid &&
    distanceInputIsValid &&
    descInputIsValid &&
    imagesInputIsValid &&
    typeInputIsValid &&
    addressInputIsValid &&
    titleInputIsValid &&
    priceInputIsValid &&
    roomsInputIsValid
  ) {
    formIsValid = true;
  }

  // Hàm gửi request tạo hotel mới
  const addNewHotel = async function (requestData) {
    setIsLoaing(true);

    //Set url theo trạng thái edit hoặc tạo mới
    let url = `http://localhost:5000/admin/new-hotel`;
    if (isEdit) {
      url = `http://localhost:5000/admin/edit-hotel/${hotelId}`;
    }

    try {
      //Chỉnh sửa lại token sau khi tạo cơ chế auth
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestData),
      });

      const data = await req.json();
      if (req.status === 401) {
        setHtppError(data);
      }
      // Nếu request thành công thì chuyển về trang hotels
      if (req.status === 201) {
        navigate("/hotels");
      }
    } catch (err) {
      setHtppError(err.message);
    }
    setIsLoaing(false);
  };

  // Xử lý sự kiện nhấn submit
  const addNewHotelHandler = function () {
    setFormError(false);

    if (
      isEdit &&
      nameRef.current.value !== "" &&
      cityRef.current.value !== "" &&
      distanceRef.current.value !== "" &&
      descRef.current.value !== "" &&
      imagesRef.current.value !== "" &&
      typeRef.current.value !== "" &&
      addressRef.current.value !== "" &&
      titleRef.current.value !== "" &&
      priceRef.current.value !== "" &&
      roomsRef.current.value !== ""
    ) {
      formIsValid = true;
    }

    // Nếu form invalid thì báo lỗi
    if (!formIsValid) {
      setFormError(true);
      return;
    }

    // Đưa data của photos và rooms vào array
    const photosSplitData = [...imagesInputValue.split(",")];
    const photosTrimmedData = photosSplitData.map((photo) => photo.trim());

    const roomsSplitData = [...roomsInputValue.split(",")];
    const roomsTrimmedData = roomsSplitData.map((room) => room.trim());

    const imagesRefValue = imagesRef.current.value.split(",");
    const imagesRefTrimmed = imagesRefValue.map((image) => image.trim());

    const roomsRefValue = roomsRef.current.value.split(",");
    const roomsRefTrimmed = roomsRefValue.map((room) => room.trim());

    //Thu thập data để gửi request
    const requestData = {
      name: isEdit ? nameRef.current.value : nameInputValue,
      type: isEdit ? typeRef.current.value : typeInputValue,
      city: isEdit ? cityRef.current.value : cityInputValue,
      address: isEdit ? addressRef.current.value : addressInputValue,
      cheapestPrice: isEdit ? priceRef.current.value : priceInputValue,
      distance: isEdit ? distanceRef.current.value : distanceInputValue,
      photos: isEdit ? imagesRefTrimmed : photosTrimmedData,
      desc: isEdit ? descRef.current.value : descInputValue,
      title: isEdit ? titleRef.current.value : titleInputValue,
      rating: 3,
      rooms: isEdit ? roomsRefTrimmed : roomsTrimmedData,
      featured: featuredOption === "no" ? false : true,
    };

    addNewHotel(requestData);
  };

  //Hàm fetch hotel Detail
  const fetchHotelDetail = useCallback(async function () {
    try {
      const res = await fetch(`http://localhost:5000/admin/hotels/${hotelId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setHotelDetail(data);
    } catch (err) {}
  }, []);

  //Nếu mode = edit thì fetch data của hotel đó đưa vào input
  useEffect(() => {
    if (isEdit) {
      fetchHotelDetail();
    }
  }, []);

  return (
    <>
      <Card>
        <h1 className={classes.title}>
          {isEdit ? "Edit Hotel" : "Add New Hotel"}
        </h1>
      </Card>

      <Card className={classes["form-card"]}>
        <div className={classes["form-container"]}>
          <form>
            <div className={classes["form-flexbox"]}>
              <div className={classes["form-flexbox-left"]}>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="name">Name</label>
                  </p>
                  <input
                    className={`${nameInputHasError && classes.error}`}
                    type="text"
                    id="name"
                    placeholder="My Hotel"
                    ref={nameRef}
                    defaultValue={
                      isEdit && hotelDetail ? hotelDetail.name : nameInputValue
                    }
                    // value={nameInputValue}
                    onChange={nameInputChangeHandler}
                    onBlur={nameInputBlurHandler}
                  />
                  {nameInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="city">City</label>
                  </p>
                  <input
                    className={`${cityInputHasError && classes.error}`}
                    type="text"
                    id="city"
                    placeholder="Ha Noi"
                    ref={cityRef}
                    defaultValue={
                      isEdit && hotelDetail ? hotelDetail.city : cityInputValue
                    }
                    // value={cityInputValue}
                    onChange={cityInputChangeHandler}
                    onBlur={cityInputBlurHandler}
                  />
                  {cityInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="distance">Distance from City Center</label>
                  </p>
                  <input
                    className={`${distanceInputHasError && classes.error}`}
                    type="text"
                    id="distance"
                    placeholder="500m"
                    ref={distanceRef}
                    defaultValue={
                      isEdit && hotelDetail
                        ? hotelDetail.distance
                        : distanceInputValue
                    }
                    // value={distanceInputValue}
                    onChange={distanceInputChangeHandler}
                    onBlur={distanceInputBlurHandler}
                  />
                  {distanceInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="desc">Description</label>
                  </p>
                  <input
                    className={`${descInputHasError && classes.error}`}
                    type="text"
                    id="desc"
                    placeholder="Description"
                    ref={descRef}
                    defaultValue={
                      isEdit && hotelDetail ? hotelDetail.desc : descInputValue
                    }
                    // value={descInputValue}
                    onChange={descInputChangeHandler}
                    onBlur={descInputBlurHandler}
                  />
                  {descInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="images">
                      Images (Nếu có nhiều link ảnh hãy sử dụng dấu phẩy giữa
                      các link)
                    </label>
                  </p>
                  <textarea
                    className={`${classes["imgs-textarea"]} ${
                      imagesInputHasError && classes["error-textarea"]
                    }`}
                    id="images"
                    ref={imagesRef}
                    defaultValue={
                      isEdit && hotelDetail
                        ? hotelDetail.photos
                        : imagesInputValue
                    }
                    // value={imagesInputValue}
                    onChange={imagesInputChangeHandler}
                    onBlur={imagesInputBlurHandler}
                  ></textarea>
                </div>
              </div>

              <div className={classes["form-flexbox-right"]}>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="type">Type</label>
                  </p>
                  <input
                    className={`${typeInputHasError && classes.error}`}
                    type="text"
                    id="type"
                    placeholder="Hotel"
                    ref={typeRef}
                    defaultValue={
                      isEdit && hotelDetail ? hotelDetail.type : typeInputValue
                    }
                    // value={typeInputValue}
                    onChange={typeInputChangeHandler}
                    onBlur={typeInputBlurHandler}
                  />
                  {typeInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="address">Address</label>
                  </p>
                  <input
                    className={`${addressInputHasError && classes.error}`}
                    type="text"
                    id="address"
                    placeholder="Hang Bong Street"
                    ref={addressRef}
                    defaultValue={
                      isEdit && hotelDetail
                        ? hotelDetail.address
                        : addressInputValue
                    }
                    // value={addressInputValue}
                    onChange={addressInputChangeHandler}
                    onBlur={addressInputBlurHandler}
                  />
                  {addressInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label htmlFor="title">Title</label>
                  </p>
                  <input
                    className={`${titleInputHasError && classes.error}`}
                    type="text"
                    id="title"
                    placeholder="Best hotel in town"
                    ref={titleRef}
                    defaultValue={
                      isEdit && hotelDetail
                        ? hotelDetail.title
                        : titleInputValue
                    }
                    // value={titleInputValue}
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
                    placeholder="Hotel"
                    ref={priceRef}
                    defaultValue={
                      isEdit && hotelDetail
                        ? hotelDetail.cheapestPrice
                        : priceInputValue
                    }
                    // value={priceInputValue}
                    onChange={priceInputChangeHandler}
                    onBlur={priceInputBlurHandler}
                  />
                  {priceInputHasError && (
                    <span className={classes["error-dot"]}>*</span>
                  )}
                </div>
                <div className={classes["form-item"]}>
                  <p className={classes.label}>
                    <label>Featured</label>
                  </p>
                  <select
                    onChange={featuredOptionHandler}
                    value={featuredOption === "no" ? "no" : featuredOption}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={classes.textarea}>
              <p>
                <label htmlFor="rooms">
                  Rooms (Nếu có nhiều phòng hãy sử dụng dấu phẩy giữa các loại
                  phòng)
                </label>
              </p>
              <textarea
                className={`${roomsInputHasError && classes["error-textarea"]}`}
                id="rooms"
                ref={roomsRef}
                defaultValue={
                  isEdit && hotelDetail ? hotelDetail.rooms : roomsInputValue
                }
                // value={roomsInputValue}
                onChange={roomsInputChangeHandler}
                onBlur={roomsInputBlurHandler}
              ></textarea>
            </div>

            <div className={classes["btn-submit"]}>
              <button type="button" onClick={addNewHotelHandler}>
                {isLoading ? "Loading..." : "Send"}
              </button>
              {formError && (
                <span className={classes["error-submit"]}>
                  Form chưa có đầy đủ thông tin. Hãy điền đầy đủ thông tin vào
                  những trường màu đỏ trước khi submit.
                </span>
              )}
              {httpError && (
                <span className={classes["error-submit"]}>{httpError}</span>
              )}
            </div>
          </form>
        </div>
      </Card>
    </>
  );
};

export default NewHotelForm;
