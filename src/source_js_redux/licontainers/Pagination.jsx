import React  from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const propTypes = {
                    items: PropTypes.array.isRequired,
                    onChangePage: PropTypes.func.isRequired,
                    initialPage: PropTypes.number
                }

const defaultProps = {
                        initialPage: 1
                    }

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
                        pager: {},
                        li_pageSize: this.props.pageSize
                };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var items = this.props.items;
        var pager = this.state.pager;
        if (page < 1 || page > pager.totalPages) {
            return;
        }
        pager = this.getPager(items.length, page);
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
        this.setState({ pager: pager });
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1;
        pageSize = this.state.li_pageSize || 10;
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 10) { startPage = 1; endPage = totalPages;}
        else if (currentPage <= 6) { startPage = 1; endPage = 10; } 
        else if (currentPage + 4 >= totalPages) { startPage = totalPages - 9; endPage = totalPages; }
        else { startPage = currentPage - 5; endPage = currentPage + 4; }
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var pages = _.range(startPage, endPage + 1);
        return { totalItems: totalItems,currentPage: currentPage,pageSize: pageSize,totalPages: totalPages,startPage: startPage,endPage: endPage,startIndex: startIndex,endIndex: endIndex,pages: pages};
    }

    render() {
        var pager = this.state.pager;
        if (!pager.pages || pager.pages.length <= 1) { return null; }
        return (
            <ul className="pagination"><li className={pager.currentPage === 1 ? 'disabled' : ''}><a onClick={() => this.setPage(1)}>First</a></li>
                <li className={pager.currentPage === 1 ? 'disabled' : ''}><a onClick={() => this.setPage(pager.currentPage - 1)}>Prev</a></li>
                { pager.pages.map((page, index) => <li key={index} className={pager.currentPage === page ? 'active' : ''}><a onClick={() => this.setPage(page)}>{page}</a></li>)}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}><a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a></li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}><a onClick={() => this.setPage(pager.totalPages)}>Last</a></li>
            </ul>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
