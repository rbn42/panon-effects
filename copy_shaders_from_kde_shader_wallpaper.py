import os
import glob
import re
path_root='./third_party/kde-shader-wallpaper/contents/ui/Shaders/'
l=glob.glob(path_root+'*.frag')
for p in l:
    name= os.path.splitext(os.path.split(p)[1])[0]
    path_dst=f'./effects/ksw-{name}'
    image_properties=[line for line in open(p) if line.startswith('// property Image iChannel')]

    if (len(image_properties))>1:
        print(f'{name} has too many images')
        continue

    if not os.path.exists(path_dst):
        os.mkdir(path_dst)

    shader_src=open(p).read()
    shader_src=shader_src.replace('iChannel0','iChannel3')
    shader_src=shader_src.replace('iChannel1','iChannel3')
    shader_src=shader_src.replace('iChannel2','iChannel3')

    with open(f'{path_dst}/image.frag','w') as f:
        f.write('#version 130\n'+shader_src)

    if len(image_properties)>0:
        image_property=image_properties[0]
        path_image=re.findall('{.+?"(.+?)".+?}',image_property)[0]
        if path_image.startswith('qrc:/Qml/Shader/'):
            path_image=path_image[len('qrc:/Qml/Shader/'):]
        path_image1=path_root+path_image
        path_image2='./third_party/kde-shader-wallpaper/contents/ui/Resources/'+path_image
        path_image3=path_image1
        if path_image.startswith('./Shader_'):
            path_image3=path_root+path_image[len('./Shader_'):]
        with open(f'{path_dst}/texture.png','wb') as f:
            if os.path.exists(path_image1):
                f.write(open(path_image1,'rb').read())
            elif os.path.exists(path_image2):
                f.write(open(path_image2,'rb').read())
            elif os.path.exists(path_image3):
                f.write(open(path_image3,'rb').read())
            else:
                print(f'No image found for {name}')

