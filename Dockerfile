# FROM jupyter/scipy-notebook

FROM python:3.8
RUN apt-get update && apt-get -y install nodejs
# RUN echo "https://mirror.tuna.tsinghua.edu.cn/alpine/edge/community" >> /etc/apk/repositories
WORKDIR /home/ubuntu/deployedapp
COPY setup.py ./
COPY . .

RUN pip install -e . -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN python -m pip install jupyterlab -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN jupyter labextension develop . --overwrite
RUN jupyter server extension enable nb2slide
RUN jlpm run build 

EXPOSE 8889 22

CMD ["jupyter", "lab", "--allow-root","--no-browser", "--ip", "\"*\"", "--notebook-dir", "./resource", "-e", "JUPYTER_TOKEN=\"easythere\"", "--port=8889"]