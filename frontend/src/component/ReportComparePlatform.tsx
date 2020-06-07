import React from 'react'
import youtube_logo from '../reportIcon/youtube_icon.svg'
import facebook_logo from '../reportIcon/facebook_icon.svg'
import handsup_logo from '../reportIcon/handsup_icon.png'
import './ReportComparePlatform.scss'
export const ReportComparePlatform:React.FC<{currentData:{'youtube':number, 'facebook':number, 'handsup':number}, pastData:{'youtube':number, 'facebook':number, 'handsup':number}}> = (props) => {
    let currentData
    let pastData
    if (props.currentData && props.pastData){
        currentData = {...props.currentData}
        pastData = {...props.pastData}
    }
    if (!currentData || !pastData){
        return <div></div>
    }
    return (
            <div className='report-compare-platform'>
                {/* <div>
                    <span className="report-compare-platform-header">Peak Views</span>
                </div> */}
                <div className='report-compare-platform-items'>
                    <div className="report-compare-platform-icon">
                        <img src={youtube_logo} alt="Logo" />
                    </div>
                    <div className="report-compare-platform-views">
                        <span className="currentViews">{currentData['youtube']}</span>
                    </div>
                    <div className="report-compare-platform-compare">
                        {
                            (currentData['youtube'] && pastData['youtube']) && currentData['youtube'] - pastData['youtube'] > 0? 
                            <><i className="fas fa-arrow-up increase"></i><span className='increase'>{currentData['youtube'] - pastData['youtube']}</span><span className='increase-percent'>({Math.round((currentData['youtube']! - pastData['youtube']!)/pastData['youtube']!*100)}%)</span></>
                            :<><i className="fas fa-arrow-down decrease"></i><span className='decrease'>{currentData['youtube']! - pastData['youtube']!}</span><span className='decrease-percent'>({Math.round((currentData['youtube']! - pastData['youtube']!)/pastData['youtube']!*100)}%)</span></>
                            }
                    </div>
                </div>
                <div className='report-compare-platform-items'>
                    <div className="report-compare-platform-icon">
                        <img src={facebook_logo} alt="Logo" />
                    </div>
                    <div className="report-compare-platform-views">
                        <span className="currentViews">{currentData['facebook']}</span>
                    </div>
                    <div className="report-compare-platform-compare">
                        {
                            (currentData['facebook'] && pastData['facebook']) && currentData['facebook'] - pastData['facebook'] > 0? 
                            <><i className="fas fa-arrow-up increase"></i><span className='increase'>{currentData['facebook'] - pastData['facebook']}</span><span className='increase-percent'>({Math.round((currentData['facebook']! - pastData['facebook']!)/pastData['facebook']!*100)}%)</span></>
                            :<><i className="fas fa-arrow-down decrease"></i><span className='decrease'>{currentData['facebook']! - pastData['facebook']!}</span><span className='decrease-percent'>({Math.round((currentData['facebook']! - pastData['facebook']!)/pastData['facebook']!*100)}%)</span></>
                            }
                    </div>
                </div>
                <div className='report-compare-platform-items'>
                    <div className="report-compare-platform-icon">
                        <img src={handsup_logo} alt="Logo" />
                    </div>
                    <div className="report-compare-platform-views">
                        <span className="currentViews">{currentData['handsup']}</span>
                    </div>
                    <div className="report-compare-platform-compare">
                        {
                            (currentData['handsup'] && pastData['handsup']) && currentData['handsup'] - pastData['handsup'] > 0? 
                            <><i className="fas fa-arrow-up increase"></i><span className='increase'>{currentData['handsup'] - pastData['handsup']}</span><span className='increase-percent'>({Math.round((currentData['handsup']! - pastData['handsup']!)/pastData['handsup']!*100)}%)</span></>
                            :<><i className="fas fa-arrow-down decrease"></i><span className='decrease'>{currentData['handsup']! - pastData['handsup']!}</span><span className='decrease-percent'>({Math.round((currentData['handsup']! - pastData['handsup']!)/pastData['handsup']!*100)}%)</span></>
                            }
                    </div>
                </div>
            </div>
    )
}
