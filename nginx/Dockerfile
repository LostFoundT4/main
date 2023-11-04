FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir "/etc/.ssl_certs/"
RUN echo $(ls -l /etc/.ssl_certs)
RUN chmod 755 "/etc/.ssl_certs/"
COPY nginx.conf /etc/nginx/conf.d