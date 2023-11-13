import scrapy


class IthelpScrapySpider(scrapy.Spider):
    name = "ithelp_scrapy"
    allowed_domains = ["ithelp.ithome.com.tw"]
    start_urls = ["https://ithelp.ithome.com.tw/"]

    def parse(self, response):
        result = [['喜歡數', '回應數', '瀏覽數', '標題', '時間', '提問人']]

        question_columns = response.css('.qa-list')

        for question_column in question_columns:
            like_count = question_column.css('.qa-condition__count')[0]
            response_count = question_column.css('.qa-condition__count')[1]
            view_count = question_column.css('.qa-condition__count')[2]
            topic = question_column.css('.qa-list__title > a')[0]
            time = question_column.css('.qa-list__info-time')[0]
            people = question_column.css('.qa-list__info-link')[0]
            
            # Extract text content and remove unwanted characters
            like_count = like_count.css('::text').get()
            response_count = response_count.css('::text').get()
            view_count = view_count.css('::text').get()
            topic = topic.css('::text').get()
            time = time.css('::text').get()
            people = people.css('::text').get()

            people = people.replace('\n', '').replace(' ', '')
            yield {
            'like_count':like_count,
            'response_count':response_count,
            'view_count':view_count,
            'topic':topic,
            'time':time,
            'people':people,
        }
        pass
