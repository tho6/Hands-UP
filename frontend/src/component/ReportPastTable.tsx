import React, { useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportQuestions, fetchReportViews } from '../redux/report/thunk';
import { RootState } from '../store';
import { IPeakViews } from '../models/IReport';

interface Data {
  meetingId: number,
  meetingName: string;
  scheduleTime: string;
  totalQuestions: number;
  inappropriateQuestions: number;
  answeredQuestions: number;
  notAnsweredQuestions: number;
  questionsFromHandsup: number;
  questionsFromYoutube: number;
  questionsFromFacebook: number;
  handsupPeakView: number;
  youtubePeakView: number;
  facebookPeakView: number;
  createdAt: string;
}

function createData(
  meetingId: number,
  meetingName: string,
  scheduleTime: string,
  totalQuestions: number,
  answeredQuestions: number,
  notAnsweredQuestions: number,
  inappropriateQuestions: number,
  questionsFromHandsup: number,
  questionsFromYoutube: number,
  questionsFromFacebook: number,
  handsupPeakView: number,
  youtubePeakView: number,
  facebookPeakView: number,
  createdAt: string,
): Data {
  return {
    meetingId,
    meetingName,
    scheduleTime,
    totalQuestions,
    answeredQuestions,
    notAnsweredQuestions,
    inappropriateQuestions,
    questionsFromHandsup,
    questionsFromYoutube,
    questionsFromFacebook,
    handsupPeakView,
    youtubePeakView,
    facebookPeakView,
    createdAt
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'meetingName', numeric: false, disablePadding: true, label: 'Meeting Name' },
  { id: 'scheduleTime', numeric: true, disablePadding: false, label: 'Schedule Time' },
  { id: 'totalQuestions', numeric: true, disablePadding: false, label: 'Total Questions' },
  { id: 'inappropriateQuestions', numeric: true, disablePadding: false, label: 'Inappropriate Questions' },
  { id: 'answeredQuestions', numeric: true, disablePadding: false, label: 'Answered Questions' },
  { id: 'notAnsweredQuestions', numeric: true, disablePadding: false, label: 'Not Answered Questions' },
  { id: 'questionsFromHandsup', numeric: true, disablePadding: false, label: 'Questions from HandsUP' },
  { id: 'questionsFromYoutube', numeric: true, disablePadding: false, label: 'Questions from Youtube' },
  { id: 'questionsFromFacebook', numeric: true, disablePadding: false, label: 'Questions from Facebook' },
  { id: 'handsupPeakView', numeric: true, disablePadding: false, label: 'HandsUP Peak View' },
  { id: 'youtubePeakView', numeric: true, disablePadding: false, label: 'Youtube Peak View' },
  { id: 'facebookPeakView', numeric: true, disablePadding: false, label: 'Facebook Peak View' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            color='default'
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRow: {
      "&$hover:hover": {
        backgroundColor: "blue"
      }
    },
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.info.main,
          backgroundColor: 'rgba(30, 183, 197, 0.23)'
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: 'rgba(30, 183, 197, 0.26)',
        },
    title: {
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Past Report
          </Typography>
        )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    checkBox: {
      "&$checked, &$checked:hover": {
        color: 'rgba(30, 183, 197, 0.8)'
      }
    },
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: "rgba(30, 183, 197, 0.1)"
      }
    },
    selected: {},
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

const GreenCheckbox: any = withStyles({
  root: {
    color: 'rgba(30, 183, 197, 0.5)',
    '&$checked': {
      color: 'rgba(30, 183, 197, 0.808)',
    },
  },
  // checked: {},
})(props => <Checkbox color="default" {...props} />);

const GreenSwitch: any = withStyles({
  switchBase: {
    color: '#efefef',
    '&$checked': {
      color: 'rgba(30, 183, 197, 0.9)',
    },
    '&$checked + $track': {
      backgroundColor: 'rgba(30, 183, 197, 0.9)',
    },
  },
  checked: {},
  track: { backgroundColor: 'rgba(30, 183, 197, 0.2)', },
  // checked: {},
})(props => <Switch color="default" {...props} />);

export function ReportPastTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('scheduleTime');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchReportQuestions('all'))
    dispatch(fetchReportViews('all'))
  }, [dispatch])

  const questions = useSelector((state: RootState) => state.report.questions)
  const views = useSelector((state: RootState) => state.report.views)
  const questionsByMeetingId = (useSelector((state: RootState) => state.report.questionsByMeetingId))
  const viewsByMeetingId = useSelector((state: RootState) => state.report.viewsByMeetingId)
  const arrQuestions = Object.keys(questionsByMeetingId).sort(function (a: string, b: string): number {
    return parseInt(b) - parseInt(a)
  })
  
  const rows: Data[] = [];
  // console.log(arrQuestions)
  // console.log(questionsByMeetingId)
  console.log(questions)
  if ( Object.keys(views).length === 0 || Object.keys(questions).length === 0) {
    return <div></div>
  } else {
    for (const id of arrQuestions) {
      const meetingViews = viewsByMeetingId[id]?.map((i: number) => views[i])
      const dataMap = [{
        "id": "Answered",
        "value": 0,
      },
      {
        "id": "Not Answered",
        "value": 0,
      },
      {
        "id": "Inappropriate",
        "value": 0,
      }]
      const dataMapQuestionFrom = [{
        "id": "youtube",
        "value": 0,
      },
      {
        "id": "facebook",
        "value": 0,
      },
      {
        "id": "handsup",
        "value": 0,
      }]
      const arrPlatformMap = [
        'youtube',
        'facebook',
        'handsup'
      ] as const
      const objViewsMap: IPeakViews = {
        youtube: {},
        facebook: {},
        handsup: {}
      }

      const meetingId = id
      const totalQuestions = questionsByMeetingId[id].length
      const meetingscheduletime = questions[questionsByMeetingId[id][0]].meetingscheduletime
      const meetingName = questions[questionsByMeetingId[id][0]].meetingname
      const meetingcreatedat = questions[questionsByMeetingId[id][0]].meetingcreatedat
      for (const qId of questionsByMeetingId[id]) {
        for (const category of dataMap) {
          if (questions[qId].isanswered && category.id === 'Answered') {
            category.value += 1
            break;
          }
          if (!questions[qId].isanswered && questions[qId].ishide && category.id === 'Inappropriate') {
            category.value += 1
            break
          }
          if (!questions[qId].isanswered && !questions[qId].ishide && category.id === 'Not Answered') {
            category.value += 1
            break
          }
        }
        for (const platform of arrPlatformMap) {
          if (!meetingViews) {
            objViewsMap[platform]['latestViews'] = 0
          } else {
            objViewsMap[platform]['latestViews'] = meetingViews.map(el => el[platform])
              .reduce(function (a, b) {
                return Math.max(a, b);
              }, -Infinity)
          }
        }
        for (const platform of dataMapQuestionFrom) {
          if (questions[qId].platformname === platform.id) {
            platform.value += 1
            break;
          }
        }

      }
      rows.push(createData(parseInt(meetingId),
        meetingName,
        new Date(meetingscheduletime).toLocaleString(),
        totalQuestions,
        dataMap.filter(el => el.id === 'Answered')[0].value,
        dataMap.filter(el => el.id === 'Not Answered')[0].value,
        dataMap.filter(el => el.id === 'Inappropriate')[0].value,
        dataMapQuestionFrom.filter(el => el.id === 'handsup')[0].value,
        dataMapQuestionFrom.filter(el => el.id === 'youtube')[0].value,
        dataMapQuestionFrom.filter(el => el.id === 'facebook')[0].value,
        objViewsMap['handsup'].latestViews!,
        objViewsMap['youtube'].latestViews!,
        objViewsMap['facebook'].latestViews!,
        new Date(meetingcreatedat).toLocaleString()
      ))
    }
  }
  
  console.log(rows)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.meetingId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  // console.log(rows)
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.meetingId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.meetingId}
                      selected={isItemSelected}
                      classes={{ selected: classes.selected }}
                      className={classes.tableRow}
                    >
                      <TableCell padding="checkbox">
                        <GreenCheckbox
                          checked={isItemSelected}
                          onChange={(event: any) => handleClick(event, row.meetingId)}
                          color='default'
                          className={classes.checkBox}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding='default' size='medium'>
                        <a href={'/report/' + row.meetingId}>{row.meetingName}</a>
                      </TableCell>
                      <TableCell align="right" size='medium'>{row.scheduleTime}</TableCell>
                      <TableCell align="right">{row.totalQuestions}</TableCell>
                      <TableCell align="right">{row.inappropriateQuestions}</TableCell>
                      <TableCell align="right">{row.answeredQuestions}</TableCell>
                      <TableCell align="right">{row.notAnsweredQuestions}</TableCell>
                      <TableCell align="right">{row.questionsFromHandsup}</TableCell>
                      <TableCell align="right">{row.questionsFromYoutube}</TableCell>
                      <TableCell align="right">{row.questionsFromFacebook}</TableCell>
                      <TableCell align="right">{row.handsupPeakView}</TableCell>
                      <TableCell align="right">{row.youtubePeakView}</TableCell>
                      <TableCell align="right">{row.facebookPeakView}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<GreenSwitch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
