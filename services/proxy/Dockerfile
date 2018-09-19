FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY wait-for.sh /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for
