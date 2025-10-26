const Course = require('app/models/course.js');
const Comment = require('app/models/comment');
const controller = require('app/http/controllers/controller');
const sm = require('sitemap');
const Episode = require('app/models/episode.js');
const rss = require('rss');
const striptags = require('striptags');

class homeController extends controller{
    async index(req,res){
        let courses = await Course.find({}).sort({createdAt : -1}).limit(8).exec();
        res.render('home/index.ejs', {courses});
    }
    async about(req,res){
        res.render('home/about.ejs');
    }
    async comment(req,res,next){
        try{
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
            let newComment = new Comment({
                user : req.user.id,
                ...req.body
            });
            await newComment.save();
            return this.back(req,res);
        } catch (error){
            next(error);
        }
    }
    async sitemap(req,res, next){
        try{
            let sitemap = sm.createSitemap({
             hostname : config.siteurl,
                cacheTime : 1000*60*10, // = 10 min
            });
            sitemap.add({url : '/', changefreq: 'daily', priority: 1});
            sitemap.add({url : '/courses',changefreq: 'weekly', priority: 1});

            let courses = await Course.find({ }).sort({ createdAt: -1}).exec();
            courses.forEach(course => {
                sitemap.add({ url: course.path(),changefreq:'weekly',priority: 0.8 });
            });
            let episodes = await Episode.find({ }).populate('course')
                .sort({ createdAt: -1}).exec();
            episodes.forEach(episode => {
                sitemap.add({ url: episode.path(),changefreq:'weekly',priority: 0.8 });
            })

            res.header('content-type', 'application/xml');
            res.send(sitemap.toString());
        } catch(error){
            next(error)
        }
    }
    async feedCourses(req, res, next) {
        try{
            let feed = new rss({
                title : 'فید خوان دوره های راکت',
                description : 'جدید اخبار دوره ها رو از طریق RSS بخوانید...',
                feed_url : `${config.siteurl}/feed/courses`,
                site_url : config.site_url
            });

            let courses = await Course.find({ }).populate('user').sort({ createdAt: -1}).exec();
            courses.forEach(course => {
            feed.item({
                title :  course.title,
                description : striptags(course.body.substr(0,100)),
                date: course.createdAt,
                url : course.path(),
                author : course.user.name
            })
            });
            res.header('content-type', 'application/xml');
            res.send(feed.xml());
        } catch(error){
            next(error);
        }
    }
    async feedEpisodes(req, res, next) {
        try{
            let feed = new rss({
                title : 'فید خوان اپیزود های دوره های راکت',
                description : 'جدید اخبار اپیزود ها رو از طریق RSS بخوانید...',
                feed_url : `${config.siteurl}/feed/episodes`,
                site_url : config.site_url
            });

            let episodes = await Episode.find({ })
                .populate({path:'course', populate: 'user'})
                .sort({ createdAt: -1}).exec();
            episodes.forEach(episode => {
                feed.item({
                    title :  episode.title,
                    description : striptags(episode.body.substr(0,100)),
                    date: episode.createdAt,
                    url : episode.path(),
                    author : episode.course.user.name
                })
            });
            res.header('content-type', 'application/xml');
            res.send(feed.xml());
        } catch(error){
            next(error);
        }
    }
}
module.exports = new homeController();