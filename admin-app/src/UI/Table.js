import classes from "./Table.module.css";

const Table = function (props) {
  const styles = classes.table + ` ${props.className}`;

  return (
    <>
      <table className={styles}>{props.children}</table>
      <div className={classes["empty-div"]}></div>
      <div className={classes["paging-div"]}>
        <span>
          1 - {props.resultsPerPage} of {props.totalPage}
        </span>
        <button>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </>
  );
};

export default Table;
