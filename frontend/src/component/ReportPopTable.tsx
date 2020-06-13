import React from "react";
import MUIDataTable from "mui-datatables";


export const ReportPopTable:React.FC<{reportPopData: {header:string, columns:string[], data:string[][]}}> = (props) => {
    const questions = props.reportPopData? {...props.reportPopData}:null
    if (!questions?.data) return <div></div>
    // const data = []
    // let idx = 1
    // for (const question of questions.data){
    //   data.push([idx, question.questioncontent?question.questioncontent:'', question.questionlikes?question.questionlikes:'', question.isanswered?'Answered':'Not Answered'])
    //   idx += 1
    // }

    const columns = questions.columns

    // const data = [
    //  ["Joe James", "Test Corp", "Yonkers", "NY"],
    //  ["John Walsh", "Test Corp", "Hartford", "CT"],
    //  ["Bob Herm", "Test Corp", "Tampa", "FL"],
    //  ["James Houston", "Test Corp", "Dallas", "TX"],
    // ];
    
    const options = {
      // filterType: "checkbox" as 'checkbox',
      responsive: 'scrollFullHeight' as 'scrollFullHeight',
      selectableRows:'none' as 'none'
      // selectableRowsHideCheckboxes:false,
      // selectableRowsOnClick:false,
      
    };
    return (
      <>
        <MUIDataTable
        
        title={questions.header}
        data={questions.data}
        columns={columns}
        options={options}
        />
      </>
    )
}
