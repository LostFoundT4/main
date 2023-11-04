FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir "/usr/share/ssl_certs/"
RUN echo $(ls -l /usr/share/)
RUN chmod 755 "/usr/share/ssl_certs"
COPY nginx.conf /etc/nginx/conf.d