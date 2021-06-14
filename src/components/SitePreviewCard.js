import { Component } from 'react';
import { Avatar, Box, Card, CardContent, Link, Skeleton, Typography } from '@material-ui/core';
import { LanguageRounded } from '@material-ui/icons';
import log from '../lib/logger';

const absolute = (base, relative) => relative ? new URL(relative, base).href : null;

class SitePreviewCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sData: null,
            imgHasLoaded: false,
        };
    }

    componentDidMount() {
        if (localStorage[this.props.url]) {
            const cache = JSON.parse(localStorage[this.props.url]);
            if (cache.expire > +new Date()) {
                log('sitePrev', 'Cache hit at', this.props.url)
                this.setState({sData: cache});
                return;
            }
        }
        (async () => {
            const html = await((await fetch('https://cors.bridged.cc/' + this.props.url)).text());
            const respDoc = new DOMParser().parseFromString(html, 'text/html');

            // Parsed data
            const title =
                respDoc.querySelector('meta[property="og:title"]')?.getAttribute('content')
                || respDoc.querySelector('title')?.textContent;
            const siteName =
                respDoc.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
                || title;
            const description =
                respDoc.querySelector('meta[property="og:description"]')?.getAttribute('content')
                || respDoc.querySelector('meta[property="description"]')?.getAttribute('content')
                || respDoc.querySelector('meta[name="description"]')?.getAttribute('content');
            const imgURL =
                absolute(this.props.url, respDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'));
            const favicon = absolute(this.props.url, respDoc.querySelector('link[rel="icon"]')?.getAttribute('href'));

            // Caching
            const date = new Date()
            // Add a day
            date.setDate(date.getDate() + 1);
            const dObj = { siteName, title, description, favicon, imgURL };
            localStorage[this.props.url] = JSON.stringify({...dObj, expire: +date});

            this.setState({sData: dObj});
        })();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state !== nextState;
    }

    render() {
        // this.props.sb();
        const loading = !!!this.state.sData;
        if (!loading) this.props.sb();

        return <Card variant='outlined' sx={{my: .8}}>
            <CardContent sx={{p: 1.25, pb: '10px!important', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                width: 400, maxWidth: '100%'}}>
                <Box display='flex' alignItems='center'>
                    { loading
                        ? <Skeleton width={20} height={20} variant='circular' animation='wave' />
                        : <Avatar sx={{width: 20, height: 20}} src={this.state.sData.favicon}>
                            <LanguageRounded sx={{width: 20, height: 20}} />
                        </Avatar>
                    }
                    <Typography variant='caption' width={loading ? 100 : 'auto'} ml={1}>{
                        loading
                            ? <Skeleton animation='wave' />
                            : this.state.sData.siteName
                    }</Typography>
                </Box>

                { /* Title */ }
                <Typography variant='h6' mt={.75} width={loading ? '60%' : 'auto'}>{
                    loading
                        ? <Skeleton width='300' animation='wave' />
                        : <Link href={this.props.url}>{this.state.sData.title ?? this.props.url}</Link>
                }</Typography>

                { /* Description and Preview Image */ }
                { loading
                    ? <>
                        <Skeleton width='100%' height={14} animation='wave' sx={{mt: .75}} />
                        <Skeleton width='100%' height={14} animation='wave' />
                        <Skeleton width='80%' height={14} animation='wave' />
                    </>
                    : <>
                        {
                            this.state.sData.description &&
                            <Typography variant='subtitle2' color='text.secondary' mt={.75}>{this.state.sData.description}</Typography>
                        }
                        {
                            this.state.sData.imgURL &&
                            <img src={this.state.sData.imgURL} alt='' onLoad={() => this.setState({imgHasLoaded: true})}
                                 onError={() => this.setState({imgHasLoaded: true})} draggable={false}
                                 style={{maxWidth: '100%', minWidth: 100, maxHeight: 213.75, marginTop: 8, borderRadius: 4}} />
                        }
                    </>
                }
                { (loading || (this.state.sData.imgURL && !this.state.imgHasLoaded)) &&
                    <Skeleton width='100%' height={213.75} animation='wave' sx={{transform: 'none', borderRadius: '7px', mt: 1}} />
                }
            </CardContent>
        </Card>
    }
}

export default SitePreviewCard;