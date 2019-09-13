package dataProvider;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayDeque;

import OCHL.OCHL;

public class DataProvider {
	private ArrayDeque<OCHL> arrDeque=new ArrayDeque<>();
	private Headers headers=new Headers();
	private String path;
	private boolean hasHeaderSet=false;
	
	public DataProvider(String path) {
		this.path=path;
	}
	public DataProvider(String path,String[] h) {
		this.path=path;
		this.setHeaders(h);
	}
	
	/**
	 * setHeaders will cause the DataProvider reproduce data queue;
	 * @param h
	 * @return
	 */
	public DataProvider setHeaders(String[] h) {
		headers.setHeaders(h);
		hasHeaderSet=true;
		arrDeque.clear();
		return this;
	}
	
	

	public ArrayDeque<OCHL> getDataQueue() {
		return arrDeque;
	}
	
	
	
	public DataProvider readFile() {
		try(FileReader fr=new FileReader(path);BufferedReader br=new BufferedReader(fr)){
			String line;
			int i=0;
			while((line=br.readLine())!=null) {
				String[] t=line.split(",");
				if(i==0&&t[0].matches("^\\d.*")) 	arrDeque.add(headers.getOCHL(t));
				else if(i==0&&!hasHeaderSet)		headers.setHeaders(t);
				else 								arrDeque.add(headers.getOCHL(t));
				i++;
			}
				
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return this;
	}
}
