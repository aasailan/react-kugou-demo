/*
 * @Author: qiao 
 * @Date: 2018-11-25 11:07:35 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-18 15:11:37
 * 搜索页面
 */
import Api from '@/api';
import { IHotSearch, ISong } from '@/api/api';
import SongItem from '@/components/SongItem/SongItem';
import SongList from '@/components/SongList/SongList';
import { IPageComponentProps, pageWrapperGenerator } from '@/page';
import Button from '@material-ui/core/Button';
import Axios, { CancelTokenSource } from 'axios';
import React, { ChangeEventHandler } from 'react';
import './search.scss';

interface IData {
  hotSearch?: IHotSearch[];
  searchList?: ISong[];
}

interface IState {
  searchText: string;
  totalResult: number;
  showSearch: boolean;
}

class Search extends React.PureComponent<IPageComponentProps<IData>, IState> {

  state: IState = {
    searchText: '',
    totalResult: 0,
    showSearch: false
  };

  source: CancelTokenSource | null = null;

  componentDidMount() {
    this.setData();
  }

  async setData() {
    const { updateData, updateError } = this.props;
    try {
      const { data: { data: { info }}} = await Api.getHotSearch();
      updateData({
        hotSearch: info
      });
    } catch (e) {
      updateError(e);
    }
  }

  // TODO: 搜索的时候添加loading，loading涉及到传送门
  searchSong = async () => {
    const { searchText } = this.state;
    if (searchText === '') {
      return
    };

    this.source && this.source.cancel('user cancel');
    this.source = Axios.CancelToken.source();
    
    const { updateData, updateError } = this.props;
    try {
      const { data: { data: { info, total }}} = await Api.searchSong(searchText, this.source.token);
      this.source = null;
      // NOTE: Promise之后setState是同步render，可以通过render的断点得出
      updateData({
        searchList: info
      });
      this.setState({
        totalResult: total,
        showSearch: true
      });
    } catch (e) {
      updateError(e);
    }
  }

  clickHotSearch = (item: IHotSearch) => {
    this.setState({
      searchText: item.keyword
    });
  }

  changeSearchText: ChangeEventHandler = (event) => {
    const input = event.target as HTMLInputElement;
    this.setState({
      searchText: input.value
    });
  }

  playMusic = (item: ISong) => {
    console.log(item);
  }

  render() {

    const { data, children } = this.props;
    if (!data) {
      return children;
    }

    const { data: { searchList = [], hotSearch = []}} = this.props;
    const { showSearch, totalResult, searchText } = this.state;

    return (
      <div>
        <div styleName="search-box">
          <div styleName="search-box__bg">
            <Button size="small" styleName="search-box__btn" variant="contained" color="primary" onClick={this.searchSong}>搜索</Button>
            <div styleName="search-box__input-wrapper">
              <span styleName="search-box__icon"/>
              <input styleName="search-box__input" value={searchText} onChange={this.changeSearchText}/>
            </div>
          </div>
        </div>
        {
          showSearch ? <div styleName="search-count">{`共有${totalResult}条搜索结果`}</div> : 
            <div styleName="search-title">最近热门</div>
        }
        {
          showSearch ? 
            <SongList songs={searchList}/> : 
            hotSearch.map((item, index) => (
              <SongItem title={item.keyword} key={index + item.keyword} showDownload={false} onClick={this.clickHotSearch.bind(this, item)}/>
            ))
        }
      </div>
    );
  }
}

export const SearchPage = pageWrapperGenerator(Search);